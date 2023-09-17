import React from 'react'
import NoteItem from './NoteItem';
import { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import '../App.css';

const CategoryItem = React.memo(({
  category,
  isListening,
  storedSelectedCategory,
  selectedCategory,
  handleCategoryClick,
  editedContent,
  editingNoteId,
  deleteCategory,
  handleCategoryEdit,
  handleEdit,
  handleChecked,
  removeNote,
  handleInputChange,
  handleInputBlur,
  categoryColors,
  onConfirm,
  onCancel,
  editedCategoryName,
  editedCategoryId,
  handleCategoryChange,
  handleCategoryBlur }) => {

  const [backgroundColor] = useState(categoryColors[category.color])

  const hasSelectedCategory = (selectedCategory && selectedCategory.id === category.id) ||
    (storedSelectedCategory && storedSelectedCategory.id === category.id
      && (isListening || storedSelectedCategory))


  return (

    <div className="category-style">
      <Droppable droppableId={`${category.id}`} type="notes">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <div
              style={{ backgroundColor: backgroundColor }}

              className={`category ${hasSelectedCategory ? 'selected-category-style' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              <div className="category-header">
                {editedCategoryId === category.id ? (
                  <textarea className={`${editedCategoryId === category.id} ? edited-category-field : '' `}
                    value={editedCategoryName || ''}
                    onChange={(e) => handleCategoryChange(e)}
                    onBlur={() => handleCategoryBlur(category.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { handleCategoryBlur(category.id) } }}
                  ></textarea>
                ) : (<h3>{category.name}</h3>)}
              </div>
              {(category && selectedCategory && selectedCategory.id === category.id) ||
                (!isListening && category && storedSelectedCategory && storedSelectedCategory.id === category.id) ? (
                <>
                  <div className="category-buttons">
                    <button onClick={(e) => handleCategoryEdit(e, category.id, category.name)}>
                      <img src="/ic_round-edit.svg" alt="edit category" />
                    </button>
                    <button onClick={() => deleteCategory(category.id, onConfirm, onCancel)}>
                      <img src="/ic_baseline-delete.svg" alt="info" />
                    </button>
                  </div>
                </>
              ) : <div className="delete-button-placeholder"></div>}
              {category.notes
                .map((note, index) => (
                  <Draggable key={note.id} draggableId={`${note.id}`} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <NoteItem
                          key={note.id}
                          note={note}
                          handleEdit={handleEdit}
                          handleChecked={handleChecked}
                          removeNote={removeNote}
                          handleInputChange={handleInputChange}
                          handleInputBlur={handleInputBlur}
                          editingNoteId={editingNoteId}
                          editedContent={editedContent}
                          category={category}
                          selectedCategory={selectedCategory}
                          storedSelectedCategory={storedSelectedCategory}
                          isListening={isListening}
                        />
                      </div>
                    )}

                  </Draggable>
                ))}
              {provided.placeholder}
            </div>

          </div>
        )}
      </Droppable>
    </div>
  )
}
)


export default CategoryItem
