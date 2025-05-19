"use client"
import React, { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import Newinput from '../../ReUseable-Component/Newinput'
import Newbutton from '../../ReUseable-Component/Newbutton'


function AddCircle({ onClose, onAddCircle }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    questions: []
  })

  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '']
  })

  const [formErrors, setFormErrors] = useState({})

  // Debug log for image changes
  useEffect(() => {
    console.log('Current formData.image:', formData.image)
  }, [formData.image])

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
    setNewQuestion(prev => ({
      ...prev,
      question: e.target.value
    }))
  }

  const handleOptionChange = (index, value) => {
    setNewQuestion(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }))
  }

  const addOption = () => {
    if (newQuestion.options.length < 4) {
      setNewQuestion(prev => ({
        ...prev,
        options: [...prev.options, '']
      }))
    }
  }

  const removeOption = (index) => {
    if (newQuestion.options.length > 2) {
      setNewQuestion(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }))
    }
  }

  const addQuestion = () => {
    if (newQuestion.question.trim() && newQuestion.options.every(opt => opt.trim())) {
      setFormData(prev => ({
        ...prev,
        questions: [...prev.questions, { ...newQuestion, id: Date.now() }]
      }))
      setNewQuestion({
        question: '',
        options: ['', '']
      })
    }
  }

  const removeQuestion = (id) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }))
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
    
    if (validateForm()) {
      const newCircle = {
        id: Date.now(),
        name: formData.title,
        description: formData.description,
        members: 0,
        type: 'Public',
        image: formData.image ? URL.createObjectURL(formData.image) : null,
        questions: formData.questions
      }
      console.log('AddCircle - Submitting circle:', newCircle)
      console.log('AddCircle - onAddCircle function:', typeof onAddCircle)
      
      if (typeof onAddCircle === 'function') {
        onAddCircle(newCircle)
      } else {
        console.error('onAddCircle is not a function!')
      }
      
      onClose()
    }
  }

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

          {/* Questions Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Questions
            </label>
            
            {/* Existing Questions */}
            {formData.questions.length > 0 && (
              <div className="space-y-3 mb-4">
                {formData.questions.map((q, index) => (
                  <div key={q.id} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{q.question}</h4>
                      <Newbutton
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(q.id)}
                        icon={<Trash2 size={16} />}
                        className="text-red-500 hover:text-red-700"
                      />
                    </div>
                    <ul className="space-y-1">
                      {q.options.map((option, optIndex) => (
                        <li key={optIndex} className="text-sm text-gray-600">
                          • {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Question */}
            <div className="p-4 border border-gray-300 rounded-md">
              <div className="space-y-4">
                <Newinput
                  value={newQuestion.question}
                  onChange={handleQuestionChange}
                  placeholder="Enter question"
                  clearable={true}
                />
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Options:</label>
                  {newQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Newinput
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1"
                      />
                      {newQuestion.options.length > 2 && (
                        <Newbutton
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOption(index)}
                          icon={<X size={20} />}
                          className="text-red-500 hover:text-red-700"
                        />
                      )}
                    </div>
                  ))}
                  
                  {newQuestion.options.length < 4 && (
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

                <Newbutton
                  variant="success"
                  onClick={addQuestion}
                  text="Add Question"
                  disabled={!newQuestion.question.trim() || !newQuestion.options.every(opt => opt.trim())}
                />
              </div>
            </div>
          </div>

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