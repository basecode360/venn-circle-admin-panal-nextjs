"use client"
import React, { useState } from 'react'
import { ArrowLeft, Edit, Trash2, Plus, X } from 'lucide-react'
import Newbutton from '../ReUseable-Component/Newbutton'
import Newinput from '../ReUseable-Component/Newinput'

function CircleDetails({ circle, onBack, onUpdate, onDeleteQuestion, onAddQuestion }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedCircle, setEditedCircle] = useState({
    ...circle,
    questions: circle.questions || []
  })
  const [showAddQuestion, setShowAddQuestion] = useState(false)
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '']
  })

  const handleSaveChanges = () => {
    onUpdate(editedCircle)
    setIsEditing(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedCircle(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDeleteQuestion = (questionId) => {
    onDeleteQuestion(circle.id, questionId)
    setEditedCircle(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }))
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

  const handleAddNewQuestion = () => {
    if (newQuestion.question.trim() && newQuestion.options.every(opt => opt.trim())) {
      onAddQuestion(circle.id, newQuestion)
      setEditedCircle(prev => ({
        ...prev,
        questions: [...prev.questions, { ...newQuestion, id: Date.now() }]
      }))
      setNewQuestion({
        question: '',
        options: ['', '']
      })
      setShowAddQuestion(false)
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Newbutton
            variant="ghost"
            onClick={onBack}
            icon={<ArrowLeft size={20} />}
            text="Back to Circles"
            className="mr-4"
          />
          <h2 className="text-2xl font-bold">Circle Details</h2>
        </div>
        <Newbutton
          variant={isEditing ? "success" : "outline"}
          onClick={isEditing ? handleSaveChanges : () => setIsEditing(true)}
          icon={<Edit size={20} />}
          text={isEditing ? "Save Changes" : "Edit Circle"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Circle Info */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-center mb-6">
              {circle.image ? (
                <img 
                  src={circle.image} 
                  alt={circle.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                />
              ) : (
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-2xl font-bold">
                    {circle.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              {isEditing ? (
                <div className="space-y-3">
                  <Newinput
                    name="name"
                    value={editedCircle.name}
                    onChange={handleInputChange}
                    placeholder="Circle name"
                  />
                  <Newinput
                    type="textarea"
                    name="description"
                    value={editedCircle.description}
                    onChange={handleInputChange}
                    placeholder="Circle description"
                    rows={3}
                  />
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-semibold mb-2">{circle.name}</h3>
                  <p className="text-gray-600 mb-4">{circle.description}</p>
                </>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Type:</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  circle.type === 'Public' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {circle.type}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Members:</span>
                <span className="text-sm font-medium">{circle.members}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Questions:</span>
                <span className="text-sm font-medium">{editedCircle.questions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Created:</span>
                <span className="text-sm text-gray-600">
                  {new Date(circle.id).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Questions</h3>
              <Newbutton
                variant="outline"
                onClick={() => setShowAddQuestion(true)}
                icon={<Plus size={16} />}
                text="Add Question"
                size="sm"
              />
            </div>

            {editedCircle.questions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No questions added yet</p>
                <Newbutton
                  onClick={() => setShowAddQuestion(true)}
                  icon={<Plus size={16} />}
                  text="Add First Question"
                  variant="outline"
                />
              </div>
            ) : (
              <div className="space-y-4">
                {editedCircle.questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-900">
                        Question {index + 1}: {question.question}
                      </h4>
                      <Newbutton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteQuestion(question.id)}
                        icon={<Trash2 size={16} />}
                        className="text-red-500 hover:text-red-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 mb-2">Options:</p>
                      <ul className="space-y-1">
                        {question.options.map((option, optIndex) => (
                          <li key={optIndex} className="text-sm text-gray-700 flex items-center">
                            <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                            {option}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Question Form */}
            {showAddQuestion && (
              <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <h4 className="font-medium mb-4">Add New Question</h4>
                <div className="space-y-4">
                  <Newinput
                    value={newQuestion.question}
                    onChange={handleQuestionChange}
                    placeholder="Enter your question"
                    label="Question"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Options:</label>
                    <div className="space-y-2">
                      {newQuestion.options.map((option, index) => (
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
                          {newQuestion.options.length > 2 && (
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
                    </div>
                    
                    {newQuestion.options.length < 4 && (
                      <Newbutton
                        variant="ghost"
                        size="sm"
                        onClick={addOption}
                        icon={<Plus size={16} />}
                        text="Add Option"
                        className="mt-2 text-blue-600 hover:text-blue-800"
                      />
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <Newbutton
                      variant="success"
                      onClick={handleAddNewQuestion}
                      text="Add Question"
                      disabled={!newQuestion.question.trim() || !newQuestion.options.every(opt => opt.trim())}
                    />
                    <Newbutton
                      variant="outline"
                      onClick={() => setShowAddQuestion(false)}
                      text="Cancel"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CircleDetails