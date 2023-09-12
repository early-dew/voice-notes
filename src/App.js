import { useState, useEffect } from 'react'
import { DragDropContext } from 'react-beautiful-dnd';
import Navbar from './components/Navbar'
import CategoryItem from './components/CategoryItem'
import Footer from './components/Footer'
// import Notification from './components/Notification';
import './App.css';


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

if (!SpeechRecognition) {
  console.log('Web Speech API is not supported')
}

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'


function App() {

  const [isListening, setIsListening] = useState(false)
  const [savedNotes, setSavedNotes] = useState([])
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [editedContent, setEditedContent] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [micTranscript, setMicTranscript] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [usedColors, setUsedColors] = useState([])
  const [storedSelectedCategory, setStoredSelectedCategory] = useState(selectedCategory)
  const [categoryColors, setCategoryColors] = useState({
    pink: '#FFBFE2',
    yellow: '#FBD73B',
    orange: '#FE9935',
    green: '#AAE9CE',
  })


  // LOCAL STORAGE - GET
  useEffect(() => {
    const data = window.localStorage.getItem('MY_SAVED_NOTES_LIST');
    if (data !== null) {
      setSavedNotes(JSON.parse(data));
    }

    const dataCat = window.localStorage.getItem('MY_CATEGORIES_LIST');
    if (dataCat !== null) {
      setCategories(JSON.parse(dataCat));
    }

    const storedColors = window.localStorage.getItem('USED_COLORS')
    if (storedColors !== null) {
      setUsedColors(JSON.parse(storedColors))
    }

  }, []);


  // LOCAL STORAGE - SET
  useEffect(() => {
    window.localStorage.setItem('MY_SAVED_NOTES_LIST', JSON.stringify(savedNotes))
    window.localStorage.setItem('MY_CATEGORIES_LIST', JSON.stringify(categories))
    window.localStorage.setItem('USED_COLORS', JSON.stringify(usedColors))
  }, [savedNotes, categories, usedColors])


  // Generate category color - max number of colors - 4 (const categoryColors)
  const generateRandomColor = (usedColors) => {
    let updatedUsedColors = [...usedColors]
    if (updatedUsedColors.length === 4) {
      updatedUsedColors = []
      setUsedColors(updatedUsedColors);
    }
    const colorOptions = Object.keys(categoryColors).filter(color => !updatedUsedColors.includes(color))
    const randomColorIndex = Math.floor(Math.random() * colorOptions.length)
    const randomColor = colorOptions[randomColorIndex]
    setUsedColors(updatedUsedColors);
    return randomColor
  };

  //Data logs
  useEffect(() => {
    console.log('selected', selectedCategory);
    console.log('stored', storedSelectedCategory)
    console.log('used colors', usedColors)
  }, [selectedCategory, storedSelectedCategory, usedColors]);


  const addNoteToStoredSelectedCategory = () => {
    const newNote = {
      id: Date.now().toString(),
      content: micTranscript,
      isChecked: false,
      categoryId: storedSelectedCategory ? storedSelectedCategory.id : categories[0].id,
    };

    setSavedNotes(prevState => [...prevState, newNote])
    setSelectedCategory(storedSelectedCategory)
    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat.id === newNote.categoryId
          ? { ...cat, notes: [...cat.notes, newNote] }
          : { ...cat }
      )
    )
  }

  const addNoteToFirstCategory = () => {
    const newNote = {
      id: Date.now().toString(),
      content: micTranscript,
      isChecked: false,
      categoryId: categories[0].id,
    }
    setSavedNotes(prevState => [...prevState, newNote])
    setCategory(categories[0].id)
    setCategories(prevCategories => [...prevCategories])
    setSelectedCategory(categories[0].id)
  }


  const addNewCategory = () => {
    const categoryName = micTranscript.replace('new category', '').trim()
    const randomColor = generateRandomColor(usedColors)

    const newCategory = {
      id: `CATEGORY_${categoryName}_${Date.now()}`,
      name: categoryName,
      color: randomColor,
      notes: [],
    }

    setCategory(newCategory)
    setSelectedCategory(newCategory)
    setCategories((prevCategories) => [...prevCategories, newCategory])
    setUsedColors((prevUsedColors) => [...prevUsedColors, randomColor])
  }


  const addDefaultCategory = () => {
    const randomColor = generateRandomColor(usedColors)

    const defaultCategory = {
      id: 'defaultCategoryId',
      name: 'Default Category',
      color: randomColor,
      notes: [],
    }

    const newNote = {
      id: Date.now().toString(),
      content: micTranscript,
      isChecked: false,
      categoryId: defaultCategory.id,
    }
    setUsedColors((prevUsedColors) => [...prevUsedColors, randomColor])
    setCategory(defaultCategory)
    setCategories(prevCategories => [...prevCategories, defaultCategory])

    setSavedNotes(prevState => [...prevState, newNote])
    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat.id === newNote.categoryId
          ? {
            ...cat, notes: [...cat.notes, newNote],
          }
          : { ...cat }
      )
    )
    setSelectedCategory(defaultCategory)
  }


  // Processing voiced transcriptions
  const processTranscript = () => {
    const transcript = micTranscript.trim()
    setMicTranscript(transcript)
    if (transcript.startsWith('new category')) {
      // add new category with the voice command 'new category'
      addNewCategory()
    } else if (!storedSelectedCategory && categories.length > 0) {
      // if no category is selectedCategory, add note to the first category
      addNoteToFirstCategory()
    } else if (categories.length === 0) {
      // if no category is present, defalut category is created and note added to it
      addDefaultCategory()
    } else if (categories.length > 0 && storedSelectedCategory) {
      // add note to the selected category even when clicked away
      addNoteToStoredSelectedCategory()
    }
  }


  // Function to start the microphone
  const startMicrophone = () => {
    mic.start();
    setMicTranscript('...')
    mic.onend = () => {
      console.log('continue...')
      mic.start()
    };
  }


  // Function to stop the microphone
  const stopMicrophone = () => {
    mic.stop();
    mic.onend = () => {
      console.log('stopped mic')
      processTranscript()
      setMicTranscript('')
    }
  }


  // Function to handle the listening state
  const handleListen = () => {
    if (isListening) {
      startMicrophone()
    } else {
      stopMicrophone()
    }


    mic.onstart = () => {
      console.log('mic is on');
    };


    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

      // Store the transcript in a state variable for reference in mic.onend
      setMicTranscript(transcript);
    };


    mic.onerror = event => {
      console.log(event.error);
    };
  };


  useEffect(() => {
    handleListen()
  }, [isListening])



  const handleCategoryClick = (category) => {
    if (!selectedCategory || category.id !== selectedCategory.id) {
      setSelectedCategory(category)
    }
  };


  // Choose the first category if none is selected
  useEffect(() => {
    if (!selectedCategory && !storedSelectedCategory) {
      setSelectedCategory(categories.length > 0 ? categories[0] : null);
    }
  }, [categories, selectedCategory, storedSelectedCategory]);


  //  Store "selectedCategory" value in "storedSelectedCategory" to preserve its value after a clickaway
  useEffect(() => {
    if (selectedCategory !== null) {
      setStoredSelectedCategory(selectedCategory);
    }
  }, [selectedCategory])


  const deleteCategory = (categoryId) => {

    const updatedCategories = categories.filter(cat => cat.id !== categoryId)
    const newSelectedCategory = updatedCategories.length > 0 ? updatedCategories[0] : null;
    const updatedNotes = savedNotes.filter(note => note.categoryId !== categoryId)
    const colorToDelete = categories.find(cat => cat.id === categoryId)

    const newUsedColors = [...usedColors]
    setUsedColors(newUsedColors.filter(color => color !== colorToDelete.color))

    if (categories.length > 0) {
      setSavedNotes(updatedNotes)
      setStoredSelectedCategory(newSelectedCategory)
      setCategories(updatedCategories)

      if (selectedCategory && selectedCategory.id === categoryId) {
        setSelectedCategory(updatedCategories[0]);
      }

    } else {
      setCategory(null)
      setSelectedCategory(null)
      setStoredSelectedCategory(null)
      setCategories([])
      setSavedNotes([])
    }

    window.localStorage.setItem('MY_CATEGORIES_LIST', JSON.stringify(updatedCategories))
    window.localStorage.setItem('MY_SAVED_NOTES_LIST', JSON.stringify(updatedNotes))
    window.localStorage.setItem('USED_COLORS', JSON.stringify(colorToDelete.color));
  };


  const removeNote = (id, catId) => {

    const updatedNotes = setSavedNotes(savedNotes.filter(n => n.id !== id))

    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.id === catId ? { ...cat, notes: cat.notes.filter(n => n.id !== id) } : cat
      )
    )

    localStorage.removeItem('MY_SAVED_NOTES_LIST', JSON.stringify(updatedNotes))
    localStorage.setItem('MY_CATEGORIES_LIST', JSON.stringify(categories))

  }


  const removeTranscript = () => {
    mic.stop();
    setMicTranscript('...')
  }


  const handleOnDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    if (result.source.droppableId === result.destination.droppableId && result.source.index === result.destination.index) {
      return;
    }
    const sourceCategory = categories.find(cat => cat.id === result.source.droppableId);

    // Remove dragged note from source category
    const [draggedNote] = sourceCategory.notes.splice(result.source.index, 1);

    // Find destination category
    const destinationCategory = categories.find(cat => cat.id === result.destination.droppableId);

    // Insert dragged note into destination category at the new index
    destinationCategory.notes.splice(result.destination.index, 0, draggedNote);

    // Update state with new categories
    setCategories([...categories]);

    // Update savedNotes state to reflect the changes
    setSavedNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === draggedNote.id ? { ...note, categoryId: destinationCategory.id } : note
      )
    )

  }


  // Notes checkmark function
  const handleChecked = (noteId) => {
    setSavedNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === noteId ? { ...note, isChecked: !note.isChecked } : note
      )
    );

    setCategories((prevCat) =>
      prevCat.map((cat) => {
        const updatedNotes = cat.notes.map((note) =>
          note.id === noteId ? { ...note, isChecked: !note.isChecked } : note
        )

        // Return the category with the updated notes
        return { ...cat, notes: updatedNotes }
      })
    );

  }


  // Note editing
  const handleEdit = (event, noteId, noteContent) => {
    event.stopPropagation()
    setEditedContent(noteContent);
    setEditingNoteId(noteId);
    setSavedNotes(prevSavedNotes =>
      prevSavedNotes.map(note =>
        note.id === noteId ? { ...note, content: editedContent } : note
      )
    )
  }


  const handleInputChange = (event) => {
    setEditedContent(event.target.value)
  }


  // Handling the changes made to the content of a note when the input field loses focus(on blur)
  const handleInputBlur = (noteId) => {

    if (editedContent.trim() !== '') {
      const updatedNotes = savedNotes.map((n) =>
        n.id === noteId ? { ...n, content: editedContent } : n
      );
      setSavedNotes(updatedNotes);
      setCategories((prevCategories) =>
        prevCategories.map(cat => ({
          ...cat,
          notes: cat.notes.map(note =>
            note.id === noteId ? { ...note, content: editedContent } : note
          )
        }))
      );

    }
    setEditingNoteId(null)
  }


  // Enter keystroke confirms the edited text
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && editingNoteId !== null) {
      handleInputBlur(editingNoteId)
    }
  };


  // Note editing
  useEffect(() => {

    // Category clickaway
    const handleClickAway = (e) => {
      if (editingNoteId !== null && !e.target.closest('.edit-input')) {
        handleInputBlur(editingNoteId)
      }
      if (selectedCategory && !e.target.closest('.category')) {
        setSelectedCategory(null)
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('click', handleClickAway);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('click', handleClickAway);
    };
  }, [editingNoteId, selectedCategory]);



  return (
    <>
      <Navbar />
      <div className="centered">
        <div className="audio-wrapper">
          <div className={`transcript-wrapper ${micTranscript ? 'active' : ''}`}>
            <div className="transcript-content">
              <p>{micTranscript}</p>
              <button className="remove-transcript" onClick={removeTranscript}><img src="remove-circled.svg" alt="remove transcribed text" />
              </button>
            </div>
          </div>
          <div className="audio-box">
            <button className="play-audio" onClick={() => setIsListening(prevState => !prevState)}
            >
              {isListening ? <img src="stop.svg" alt="stop" /> : <img src="icon-park-solid_play.svg" alt="play" />}
            </button>
          </div>
        </div>
        <div className="my-notes-wrapper">
          <h1>my notes</h1>
          <div className="categories-wrapper">
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <ul className="categories-collection">
                {categories.map((category) => (
                  <CategoryItem
                    key={category.id}
                    category={category}
                    categories={categories}
                    deleteCategory={deleteCategory}
                    handleEdit={handleEdit}
                    handleChecked={handleChecked}
                    removeNote={removeNote}
                    handleInputChange={handleInputChange}
                    handleInputBlur={handleInputBlur}
                    categoryColors={categoryColors}
                    savedNotes={savedNotes}
                    editingNoteId={editingNoteId}
                    editedContent={editedContent}
                    selectedCategory={selectedCategory}
                    handleCategoryClick={handleCategoryClick}
                    isListening={isListening}
                    storedSelectedCategory={storedSelectedCategory}
                  />
                ))}
              </ul>
            </DragDropContext>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );

}



export default App;
