"use client"
import React, { useState, useEffect } from 'react'
import { X, Plus, Trash2, Edit } from 'lucide-react'
import Newinput from '../../ReUseable-Component/Newinput'
import Newbutton from '../../ReUseable-Component/Newbutton'

function AddCircle({ onClose, onAddCircle }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    type: 'filltered'
  })

  // Separate state for question being edited
  const [questionData, setQuestionData] = useState({
    question: '',
    options: ['', ''],
    isEditing: false,
    editingId: null // Track which question is being edited
  })

  // State for the list of questions (max 3)
  const [questions, setQuestions] = useState([])

  const [formErrors, setFormErrors] = useState({})

  // Debug logs for tracking state
  useEffect(() => {
    console.log('Current formData:', formData)
    console.log('Current questions:', questions)
  }, [formData, questions])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleFileSelect = (file) => {
    console.log('File selected:', file)
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }))
    }
  }

  const handleQuestionChange = (e) => {
    setQuestionData(prev => ({
      ...prev,
      question: e.target.value
    }))
  }

  const handleOptionChange = (index, value) => {
    setQuestionData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }))
  }

  const addOption = () => {
    // Maximum 3 options
    if (questionData.options.length < 3) {
      setQuestionData(prev => ({
        ...prev,
        options: [...prev.options, '']
      }))
    }
  }

  const removeOption = (index) => {
    if (questionData.options.length > 2) {
      setQuestionData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }))
    }
  }

  // Show the question input fields for adding a new question
  const showQuestionInput = () => {
    setQuestionData({
      question: '',
      options: ['', ''],
      isEditing: true,
      editingId: null
    })
  }

  // Edit an existing question
  const editQuestion = (questionId) => {
    const questionToEdit = questions.find(q => q.id === questionId)
    if (questionToEdit) {
      setQuestionData({
        question: questionToEdit.question,
        options: [...questionToEdit.options],
        isEditing: true,
        editingId: questionId
      })
    }
  }

  // Save the current question (either new or edited)
  const saveQuestion = () => {
    if (questionData.question.trim() && questionData.options.every(opt => opt.trim())) {
      if (questionData.editingId) {
        // Update existing question
        setQuestions(prev => prev.map(q => 
          q.id === questionData.editingId ? 
          {
            ...q,
            question: questionData.question,
            options: [...questionData.options]
          } : q
        ))
      } else {
        // Add new question
        const questionToAdd = {
          question: questionData.question,
          options: [...questionData.options],
          id: Date.now() // Ensure unique ID
        }
        
        // Add the question to questions array
        setQuestions(prev => [...prev, questionToAdd])
      }
      
      // Reset the question form and hide it
      setQuestionData({
        question: '',
        options: ['', ''],
        isEditing: false,
        editingId: null
      })
    }
  }

  // Cancel question editing
  const cancelEditQuestion = () => {
    setQuestionData({
      question: '',
      options: ['', ''],
      isEditing: false,
      editingId: null
    })
  }

  const removeQuestion = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.title.trim()) {
      errors.title = 'Circle title is required'
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Only save current question if type is 'Unfillter' and the question is being edited
    if (formData.type === 'Unfillter' && questionData.isEditing && 
        questionData.question.trim() && 
        questionData.options.every(opt => opt.trim())) {
      saveQuestion()
    }
    
    if (validateForm()) {
      // Create submission data including the questions - but only for Unfillter type
      const submissionData = {
        id: Date.now(),
        name: formData.title,
        description: formData.description,
        members: 0,
        type: formData.type,
        image: formData.image ? URL.createObjectURL(formData.image) : null,
        // Only include questions for Unfillter type
        questions: formData.type === 'Unfillter' ? [...questions] : []
      }
      
      console.log('AddCircle - Submitting circle with type:', formData.type)
      console.log('AddCircle - Submitting circle with questions:', submissionData.questions)
      
      if (typeof onAddCircle === 'function') {
        onAddCircle(submissionData)
        onClose()
      } else {
        console.error('onAddCircle is not a function!')
      }
    }
  }

  // Maximum allowed questions count
  const MAX_QUESTIONS = 3

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Circle Details</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <Newinput
            label="Circle Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter circle title"
            required={true}
            error={formErrors.title}
            clearable={true}
          />

          {/* Description */}
          <Newinput
            type="textarea"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter circle description"
            required={true}
            error={formErrors.description}
            rows={3}
            resize={true}
          />

          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Circle Type *</label>
            <div className="flex items-center space-x-2 mb-2">
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="filltered">Filtered</option>
                <option value="Unfillter">Unfiltered</option>
              </select>
            </div>
            <div className="text-sm text-gray-500 italic">
              {formData.type === 'filltered' ? 
                "Filtered circles don't include questions" : 
                "Unfiltered circles allow adding questions"}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Newinput
              type="file"
              label="Circle Image"
              accept="image/*"
              onFileSelect={handleFileSelect}
              maxSize={5}
              showPreview={true}
              helperText="Upload an image for your circle (max 5MB)"
              id="circle-image-upload"
            />
            {/* Debug info */}
            {formData.image && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <p>Selected file: {formData.image.name}</p>
                <p>Size: {(formData.image.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}
          </div>

          {/* Questions Section - Only show when type is Unfillter */}
          {formData.type === 'Unfillter' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Questions
                </label>
                <span className="text-sm text-gray-500">({questions.length}/{MAX_QUESTIONS} questions)</span>
              </div>
              
              {/* Existing Questions */}
              {questions.length > 0 && (
                <div className="space-y-3 mb-4">
                  {questions.map((q, index) => (
                    <div key={q.id} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">Question {index + 1}: {q.question}</h4>
                        <div className="flex space-x-2">
                          <Newbutton
                            variant="ghost"
                            size="sm"
                            onClick={() => editQuestion(q.id)}
                            icon={<Edit size={16} />}
                            className="text-blue-500 hover:text-blue-700"
                          />
                          <Newbutton
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(q.id)}
                            icon={<Trash2 size={16} />}
                            className="text-red-500 hover:text-red-700"
                          />
                        </div>
                      </div>
                      <ul className="space-y-1">
                        {q.options.map((option, optIndex) => (
                          <li key={optIndex} className="text-sm text-gray-600">
                            {String.fromCharCode(65 + optIndex)}. {option}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Question input fields - shown when editing a question */}
              {questionData.isEditing && (
                <div className="p-4 border border-gray-300 rounded-md mb-4">
                  <div className="space-y-4">
                    <Newinput
                      value={questionData.question}
                      onChange={handleQuestionChange}
                      placeholder="Enter question"
                      clearable={true}
                    />
                    
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700">Options:</label>
                      {questionData.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <Newinput
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`Option ${String.fromCharCode(65 + index)}`}
                            className="flex-1"
                          />
                          {questionData.options.length > 2 && (
                            <Newbutton
                              variant="ghost"
                              size="icon"
                              onClick={() => removeOption(index)}
                              icon={<X size={16} />}
                              className="text-red-500 hover:text-red-700"
                            />
                          )}
                        </div>
                      ))}
                      
                      {questionData.options.length < 3 && (
                        <Newbutton
                          variant="ghost"
                          size="sm"
                          onClick={addOption}
                          icon={<Plus size={16} />}
                          text="Add Option"
                          className="text-blue-600 hover:text-blue-800"
                        />
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <Newbutton
                        variant="success"
                        type="button"
                        onClick={saveQuestion}
                        text={questionData.editingId ? "Update Question" : "Save Question"}
                        disabled={!questionData.question.trim() || !questionData.options.every(opt => opt.trim())}
                        className="flex-1"
                      />
                      <Newbutton
                        variant="ghost"
                        type="button"
                        onClick={cancelEditQuestion}
                        text="Cancel"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Add Question Button - only show when not currently editing a question and less than MAX_QUESTIONS questions */}
              {!questionData.isEditing && questions.length < MAX_QUESTIONS && (
                <Newbutton
                  variant="outline"
                  size="md"
                  onClick={showQuestionInput}
                  icon={<Plus size={16} />}
                  text="Add Question"
                  className="w-full mb-4"
                />
              )}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <Newbutton
              type="submit"
              variant="default"
              size="lg"
              text="Create Circle"
              className="flex-1"
            />
            <Newbutton
              type="button"
              variant="outline"
              size="lg"
              onClick={onClose}
              text="Cancel"
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCircle