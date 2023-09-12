import React from 'react'

const NoteItem = React.memo(({
  note,
  isListening,
  storedSelectedCategory,
  handleEdit,
  selectedCategory,
  handleInputChange,
  handleInputBlur,
  handleChecked,
  editingNoteId,
  editedContent,
  removeNote,
  category }) => {


  const isSelected = (category && selectedCategory && selectedCategory.id === category.id) ||
    (!isListening && category && storedSelectedCategory && storedSelectedCategory.id === category.id)

  return (

    <li className="notes-holder">
      {editingNoteId === note.id ? (
        <textarea
          className={`edit-input ${editingNoteId === note.id ? 'editing' : ''}`}
          value={editedContent || ''}
          onChange={(e) => handleInputChange(e, note.content)}
          onBlur={() => handleInputBlur(note.id)}
          onKeyDown={(e) => { if (e.key === 'Enter') { handleInputBlur(note.id) } }}
          style={{ resize: 'none' }}
        >
        </textarea>
      ) : (
        <>
          <div className="note-content">
            {isSelected ? (
              <label className="checkbox-holder">
                <input
                  type="checkbox"
                  onChange={() => handleChecked(note.id, note.content)}
                  checked={note.isChecked} />
                <span className="checkmark"></span>
              </label>
            ) : null}
            <span className={note.isChecked ? 'strikethrough' : ''}>{note.content}</span>
          </div>
          {isSelected ? (
            <div className="note-buttons">
              <button onClick={(e) => handleEdit(e, note.id, note.content)}>
                <img src="round-edit-small.svg" alt="edit" />
              </button>
              <button onClick={() => removeNote(note.id, category.id)}>
                <img src="baseline-delete-small.svg" alt="delete" />
              </button>
            </div>

          ) : <div className="note-icons-placeholder"></div>}
        </>
      )}
    </li>

  )
})

export default NoteItem