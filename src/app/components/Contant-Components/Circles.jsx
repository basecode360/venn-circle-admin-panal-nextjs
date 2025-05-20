"use client"
import React, { useState } from 'react'
import { Circle, Search, Plus, ArrowLeft, X, Trash2, Upload, Edit } from 'lucide-react'
import AddCircle from './AddCircles/page' // Import the AddCircle component

function Circles({ circles = [], setCircles = () => { } }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [viewingCircle, setViewingCircle] = useState(null)
  const [editingCircleId, setEditingCircleId] = useState(null)

  // Question editing states
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [questionForm, setQuestionForm] = useState({ question: '', options: ['', ''] })
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '']
  })

  const filteredCircles = circles.filter(circle =>
    circle.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    circle.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle new circle from AddCircle component
  const handleAddCircle = (newCircle) => {
    console.log('Circles - Received new circle:', newCircle)
    setCircles([...circles, newCircle])
  }

  // View details handlers
  const handleViewDetails = (circle) => {
    // Only allow viewing details for "Unfillter" type circles
    if (circle.type === 'Unfillter') {
      // Ensure questions array exists
      const circleWithQuestions = {
        ...circle,
        questions: circle.questions || []
      }
      setViewingCircle(circleWithQuestions)
    } else {
      // Show alert or toast notification
      alert("Filtered circles don't have details to view.")
    }
  }

  const handleBackToList = () => {
    setShowAddForm(false)
    setViewingCircle(null)
  }

  // Question handlers for editing
  const handleQuestionChange = (e) => {
    setNewQuestion({
      ...newQuestion,
      question: e.target.value
    })
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...newQuestion.options]
    newOptions[index] = value
    setNewQuestion({
      ...newQuestion,
      options: newOptions
    })
  }

  const addOption = () => {
    if (newQuestion.options.length < 4) {
      setNewQuestion({
        ...newQuestion,
        options: [...newQuestion.options, '']
      })
    }
  }

  const removeOption = (index) => {
    if (newQuestion.options.length > 2) {
      const newOptions = newQuestion.options.filter((_, i) => i !== index)
      setNewQuestion({
        ...newQuestion,
        options: newOptions
      })
    }
  }

  // Edit question handlers
  const handleEditQuestion = (question) => {
    setEditingQuestion(question.id)
    setQuestionForm({
      question: question.question,
      options: [...question.options]
    })
  }

  const saveEditedQuestion = () => {
    if (questionForm.question.trim() && questionForm.options.every(opt => opt.trim())) {
      const updatedCircle = {
        ...viewingCircle,
        questions: viewingCircle.questions.map(q =>
          q.id === editingQuestion
            ? { ...q, question: questionForm.question, options: questionForm.options }
            : q
        )
      }
      setCircles(prev => prev.map(c => c.id === updatedCircle.id ? updatedCircle : c))
      setViewingCircle(updatedCircle)
      setEditingQuestion(null)
      setQuestionForm({ question: '', options: ['', ''] })
    }
  }

  const deleteQuestion = (questionId) => {
    const updatedCircle = {
      ...viewingCircle,
      questions: viewingCircle.questions.filter(q => q.id !== questionId)
    }
    setCircles(prev => prev.map(c => c.id === updatedCircle.id ? updatedCircle : c))
    setViewingCircle(updatedCircle)
  }

  const addNewQuestion = () => {
    if (newQuestion.question.trim() && newQuestion.options.every(opt => opt.trim()) && viewingCircle.questions.length < 2) {
      const questionToAdd = {
        ...newQuestion,
        id: Date.now()
      }
      const updatedCircle = {
        ...viewingCircle,
        questions: [...viewingCircle.questions, questionToAdd]
      }
      setCircles(prev => prev.map(c => c.id === updatedCircle.id ? updatedCircle : c))
      setViewingCircle(updatedCircle)
      setNewQuestion({ question: '', options: ['', ''] })
    }
  }

  // CIRCLE DETAILS VIEW
  if (viewingCircle) {
    // If the circle is filtered type, redirect back to list
    if (viewingCircle.type === 'filltered') {
      // Use setTimeout to ensure the redirect happens after render
      setTimeout(() => {
        handleBackToList();
      }, 100);
      
      // Show loading/message in the meantime
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-8">
            <p className="text-lg font-medium mb-4">Redirecting back to circles list...</p>
            <p className="text-gray-500">Filtered circles do not have details view</p>
          </div>
        </div>
      );
    }

    return (
      <div className="overflow-y-auto bg-gray-50">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={handleBackToList}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={20} />
              <span>Back to Circles</span>
            </button>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Circle Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              {viewingCircle.image && (
                <div className="mb-4">
                  <img
                    src={viewingCircle.image}
                    alt={viewingCircle.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              <h1 className="text-2xl font-bold mb-2">{viewingCircle.name}</h1>
              <p className="text-gray-600 mb-4">{viewingCircle.description}</p>
              <div className="flex space-x-4 text-sm">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{viewingCircle.type}</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{viewingCircle.members} Members</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">{viewingCircle.questions.length} Questions</span>
              </div>
            </div>

            {/* Questions Section - Only show for Unfillter circles */}
            {viewingCircle.type === 'Unfillter' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Questions</h2>
                </div>

                {/* Questions List */}
                {viewingCircle.questions.length > 0 ? (
                  <div className="space-y-4">
                    {viewingCircle.questions.map((question, index) => (
                      <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                        {editingQuestion === question.id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={questionForm.question}
                              onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                              className="w-full p-2 border border-gray-300 rounded-md"
                              placeholder="Question text"
                            />
                            <div className="space-y-2">
                              {questionForm.options.map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center space-x-2">
                                  <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                                    {String.fromCharCode(65 + optIndex)}
                                  </span>
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...questionForm.options]
                                      newOptions[optIndex] = e.target.value
                                      setQuestionForm({ ...questionForm, options: newOptions })
                                    }}
                                    className="flex-1 p-2 border border-gray-300 rounded-md"
                                    placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                  />
                                  {questionForm.options.length > 2 && (
                                    <button
                                      onClick={() => {
                                        const newOptions = questionForm.options.filter((_, i) => i !== optIndex)
                                        setQuestionForm({ ...questionForm, options: newOptions })
                                      }}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <X size={16} />
                                    </button>
                                  )}
                                </div>
                              ))}
                              {questionForm.options.length < 4 && (
                                <button
                                  onClick={() => setQuestionForm({ ...questionForm, options: [...questionForm.options, ''] })}
                                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  <Plus size={14} />
                                  <span>Add Option</span>
                                </button>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={saveEditedQuestion}
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingQuestion(null)}
                                className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="font-medium text-gray-900">
                                Question {index + 1}: {question.question}
                              </h3>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditQuestion(question)}
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => deleteQuestion(question.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              {question.options.map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center space-x-3">
                                  <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium">
                                    {String.fromCharCode(65 + optIndex)}
                                  </span>
                                  <span className="text-gray-700">{option}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No questions added yet</p>
                  </div>
                )}

                {/* Add New Question Form */}
                <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Add New Question</h4>
                    <span className="text-sm text-gray-500">({viewingCircle.questions.length}/2 questions)</span>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newQuestion.question}
                      onChange={handleQuestionChange}
                      placeholder="Enter question"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <div className="space-y-2">
                      {newQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`Option ${String.fromCharCode(65 + index)}`}
                            className="flex-1 p-2 border border-gray-300 rounded-md"
                          />
                          {newQuestion.options.length > 2 && (
                            <button
                              onClick={() => removeOption(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                      {newQuestion.options.length < 4 && (
                        <button
                          onClick={addOption}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <Plus size={14} />
                          <span>Add Option</span>
                        </button>
                      )}
                    </div>
                    <button
                      onClick={addNewQuestion}
                      disabled={!newQuestion.question.trim() || !newQuestion.options.every(opt => opt.trim()) || viewingCircle.questions.length >= 2}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Question ({viewingCircle.questions.length}/2)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Use the AddCircle component instead of the built-in form
  if (showAddForm) {
    return (
      <div className="h-full overflow-y-auto bg-gray-50">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setShowAddForm(false)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={20} />
              <span>Back to Circles</span>
            </button>
          </div>

          {/* Render the AddCircle component */}
          <AddCircle
            onClose={() => setShowAddForm(false)}
            onAddCircle={handleAddCircle}
          />
        </div>
      </div>
    )
  }

  // CIRCLES LIST VIEW
  return (
    <div className="p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Circles Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Add Circle</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search circles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Debug Info */}
      <div className="mb-4 p-3 bg-blue-50 rounded">
        <p className="text-sm">Total Circles: {circles.length}</p>
        <p className="text-sm">Showing: {filteredCircles.length}</p>
      </div>

      {/* Circles Grid */}
      {circles.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Circle size={40} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Circles Yet</h3>
          <p className="text-gray-500 mb-6">Create your first circle to get started.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mx-auto"
          >
            <Plus size={20} />
            <span>Create First Circle</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCircles.map((circle) => (
            <div key={circle.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 relative">
              {/* Card Status Badge */}
              <div className={`absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-xs font-semibold ${
                circle.type === 'filltered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
              }`}>
                {circle.type === 'filltered' ? 'Filtered' : 'Unfiltered'}
              </div>
              
              {/* Card Image with Gradient Overlay */}
              {circle.image ? (
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30 z-0"></div>
                  <img
                    src={circle.image}
                    alt={circle.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              ) : (
                <div className="h-32 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center">
                  <Circle size={40} className="text-indigo-300" />
                </div>
              )}

              {/* Card Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">{circle.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{circle.description}</p>
                </div>

                <div className="space-y-4 mb-4">
                  {/* Filter Toggle */}
                  <div className="flex justify-between items-center py-2 border-t border-b border-gray-100">
                    <div className="flex items-center">
                      <label className="font-medium text-sm mr-2 text-gray-700">Type:</label>
                      <span className={`text-sm font-medium ${circle.type === 'filltered' ? 'text-green-600' : 'text-blue-600'}`}>
                        {circle.type === 'filltered' ? 'Filtered' : 'Unfiltered'}
                      </span>
                    </div>
                    
                    {/* Toggle Switch */}
                    <div 
                      className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ease-in-out duration-200 ${
                        circle.type === 'filltered' ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      onClick={() => {
                        const updatedType = circle.type === 'filltered' ? 'Unfillter' : 'filltered';
                        const updatedCircle = { ...circle, type: updatedType };
                        setCircles(prev =>
                          prev.map(c => c.id === circle.id ? updatedCircle : c)
                        );
                      }}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ease-in-out duration-200 ${
                          circle.type === 'filltered' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-600">Members:</span>
                      <span className="text-sm font-medium bg-gray-100 px-2 py-0.5 rounded">{circle.members || 0}</span>
                    </div>
                    
                    {circle.questions && circle.questions.length > 0 && circle.type === 'Unfillter' && (
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-600">Questions:</span>
                        <span className="text-sm font-medium bg-purple-100 text-purple-600 px-2 py-0.5 rounded">{circle.questions.length}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Only show View Details button for Unfiltered circles */}
                {circle.type === 'Unfillter' ? (
                  <button
                    onClick={() => handleViewDetails(circle)}
                    className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    View Details
                  </button>
                ) : (
                  <div className="w-full px-4 py-2.5 bg-gray-100 text-gray-400 rounded-md text-center font-medium">
                    No Details Available
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Circles