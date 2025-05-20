import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Users,
  Eye,
  Upload,
} from "lucide-react";

export default function CircleManagement({ user, supabase, onLogout }) {
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [editingCircle, setEditingCircle] = useState(null);

  // Form state
  const [circleName, setCircleName] = useState("");
  const [circleDescription, setCircleDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [bannerImage, setBannerImage] = useState("");
  const [iconImage, setIconImage] = useState("");
  const [questions, setQuestions] = useState([
    {
      id: "1",
      question: "",
      answers: ["", "", "", ""],
    },
  ]);

  // Handle image uploads
  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${Date.now()}.${fileExt}`;
      const filePath = `circle_images/${fileName}`;
      
      // Use a simpler approach for now - convert to base64 and store the string
      // This works without needing to set up Supabase storage buckets
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const base64String = reader.result;
          if (type === 'banner') {
            setBannerImage(base64String);
          } else if (type === 'icon') {
            setIconImage(base64String);
          }
          resolve(base64String);
        };
        reader.onerror = (error) => {
          console.error(`Error reading ${type} file:`, error);
          setFormError(`Failed to read ${type} file`);
          reject(error);
        };
      });
      
      /* 
      // This is the Supabase storage approach - keep it commented out until you set up a bucket
      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('images')  // Replace with your bucket name once created
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      const imageUrl = data.publicUrl;
      
      // Update state based on image type
      if (type === 'banner') {
        setBannerImage(imageUrl);
      } else if (type === 'icon') {
        setIconImage(imageUrl);
      }
      */
      
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
      setFormError(`Failed to upload ${type} image: ${error.message}`);
    }
  };

  // Load circles on component mount
  useEffect(() => {
    if (supabase) {
      loadCircles();
    }
  }, [supabase]);

  const loadCircles = async () => {
    if (!supabase) {
      console.error("Supabase client is not available");
      setFormError("Database connection not available");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("circles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCircles(data || []);
    } catch (error) {
      console.error("Error loading circles:", error);
      setFormError("Failed to load circles");
    } finally {
      setLoading(false);
    }
  };

  // Add new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: (questions.length + 1).toString(),
        question: "",
        answers: ["", "", "", ""],
      },
    ]);
  };

  // Update question text
  const updateQuestion = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  // Update answer text
  const updateAnswer = (questionIndex, answerIndex, value) => {
    const updated = [...questions];
    updated[questionIndex].answers[answerIndex] = value;
    setQuestions(updated);
  };

  // Remove question
  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  // Reset form
  const resetForm = () => {
    setCircleName("");
    setCircleDescription("");
    setVisibility("public");
    setBannerImage("");
    setIconImage("");
    setQuestions([{ id: "1", question: "", answers: ["", "", "", ""] }]);
    setEditingCircle(null);
    setShowForm(false);
    setFormError("");
  };

  // Edit circle
  const startEditing = (circle) => {
    setEditingCircle(circle);
    setCircleName(circle.name);
    setCircleDescription(circle.description || "");
    setVisibility(circle.visibility || "public");
    setBannerImage(circle.banner_image || "");
    setIconImage(circle.icon_image || "");

    // Load existing questions or create default one
    if (circle.join_questions && circle.join_questions.length > 0) {
      const loadedQuestions = circle.join_questions.map((q, index) => ({
        id: q.id || (index + 1).toString(),
        question: q.question || "",
        answers: q.answers
          ? q.answers.map((a) => a.text || "")
          : ["", "", "", ""],
      }));
      setQuestions(loadedQuestions);
    } else {
      setQuestions([{ id: "1", question: "", answers: ["", "", "", ""] }]);
    }

    setShowForm(true);
  };

  // Delete circle
  const deleteCircle = async (circleId) => {
    if (!confirm("Are you sure you want to delete this circle?")) return;

    if (!supabase) {
      console.error("Supabase client is not available");
      setFormError("Database connection not available");
      return;
    }

    try {
      const { error } = await supabase
        .from("circles")
        .delete()
        .eq("id", circleId);

      if (error) throw error;

      loadCircles();
      alert("Circle deleted successfully!");
    } catch (error) {
      console.error("Error deleting circle:", error);
      alert("Error deleting circle: " + error.message);
    }
  };

  // Validate form
  const validateForm = () => {
    // Check circle name
    if (!circleName.trim()) {
      setFormError("Circle name is required");
      return false;
    }

    // Check if all questions have text and all answers are filled
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setFormError(`Question ${i + 1} is required`);
        return false;
      }
      for (let j = 0; j < q.answers.length; j++) {
        if (!q.answers[j].trim()) {
          setFormError(`Question ${i + 1}, Answer ${j + 1} is required`);
          return false;
        }
      }
    }

    return true;
  };

  // Format questions for database storage
  const formatQuestionsForDb = () => {
    return questions.map((q, qIndex) => ({
      id: `q${qIndex + 1}`,
      question: q.question.trim(),
      order: qIndex + 1,
      answers: q.answers.map((answer, aIndex) => ({
        id: `q${qIndex + 1}a${aIndex + 1}`,
        text: answer.trim(),
        order: aIndex + 1,
      })),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!supabase) {
      console.error('Supabase client is not available');
      setFormError('Database connection not available');
      return;
    }
    
    // Validate form inputs
    if (!validateForm()) return;
  
    // Format questions for database
    const formattedQuestions = formatQuestionsForDb();
  
    try {
      setSubmitting(true);
      
      if (editingCircle) {
        // Update existing circle
        const { error } = await supabase
          .from('circles')
          .update({
            name: circleName.trim(),
            description: circleDescription.trim(),
            visibility: visibility,
            banner_image: bannerImage,
            icon_image: iconImage,
            join_questions: formattedQuestions,
            
          })
          .eq('id', editingCircle.id);
        
        if (error) throw error;
        alert('Circle updated successfully!');
      } else {
        // Create new circle
        const { error } = await supabase
          .from('circles')
          .insert([
            {
              name: circleName.trim(),
              description: circleDescription.trim(),
              visibility: visibility,
              banner_image: bannerImage,
              icon_image: iconImage,
              created_by: user.id,
              join_questions: formattedQuestions,
              member_count: 1,
              is_official: false,
              is_filtered: false,
              auto_join: false
              // Removed the "members" array that was causing the error
            }
          ]);
  
        if (error) throw error;
        alert('Circle created successfully!');
      }
      
      // Reset form and reload circles
      resetForm();
      loadCircles();
      
    } catch (error) {
      console.error('Error submitting circle:', error);
      setFormError('Error saving circle: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading circles...</p>
        </div>
      </div>
    );
  }

  // Render component
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Circle Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and manage your circles with custom join questions
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>{showForm ? "Cancel" : "Create New Circle"}</span>
        </button>
      </div>

      {/* Error Display */}
      {formError && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          <p>{formError}</p>
        </div>
      )}

      {/* Create/Edit Circle Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            {editingCircle ? "Edit Circle" : "Create New Circle"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Circle Name *
                </label>
                <input
                  type="text"
                  value={circleName}
                  onChange={(e) => setCircleName(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter circle name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={circleDescription}
                  onChange={(e) => setCircleDescription(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Describe your circle"
                  rows="3"
                />
              </div>
            </div>

            {/* Visibility Setting */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Visibility
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={visibility === "public"}
                    onChange={() => setVisibility("public")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    Public
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={visibility === "private"}
                    onChange={() => setVisibility("private")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    Private
                  </span>
                </label>
              </div>
            </div>

            {/* Image Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Banner Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Banner Image
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <label className="flex flex-col items-center px-4 py-2 bg-white dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600">
                    <Upload className="h-5 w-5 text-gray-400 dark:text-gray-300" />
                    <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Upload
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "banner")}
                    />
                  </label>
                  {bannerImage && (
                    <div className="relative h-20 w-36 overflow-hidden rounded-md border border-gray-300 dark:border-gray-600">
                      <img
                        src={bannerImage}
                        alt="Banner preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setBannerImage("")}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs"
                      >
                        &times;
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Icon Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Icon Image
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <label className="flex flex-col items-center px-4 py-2 bg-white dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600">
                    <Upload className="h-5 w-5 text-gray-400 dark:text-gray-300" />
                    <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Upload
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "icon")}
                    />
                  </label>
                  {iconImage && (
                    <div className="relative h-16 w-16 overflow-hidden rounded-full border border-gray-300 dark:border-gray-600">
                      <img
                        src={iconImage}
                        alt="Icon preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setIconImage("")}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs"
                      >
                        &times;
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Questions Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Join Questions *
                </label>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Question</span>
                </button>
              </div>

              {questions.map((question, qIndex) => (
                <div
                  key={qIndex}
                  className="border border-gray-200 dark:border-gray-600 p-4 rounded-lg mb-4 bg-gray-50 dark:bg-gray-700"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Question {qIndex + 1}
                    </h4>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400"
                        aria-label="Remove question"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Enter your question"
                    value={question.question}
                    onChange={(e) => updateQuestion(qIndex, e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {question.answers.map((answer, aIndex) => (
                      <input
                        key={aIndex}
                        type="text"
                        placeholder={`Answer ${aIndex + 1}`}
                        value={answer}
                        onChange={(e) =>
                          updateAnswer(qIndex, aIndex, e.target.value)
                        }
                        className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                        required
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={submitting}
                className={`px-6 py-2 rounded-lg font-medium ${
                  submitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white transition-colors`}
              >
                {submitting
                  ? editingCircle
                    ? "Updating..."
                    : "Creating..."
                  : editingCircle
                  ? "Update Circle"
                  : "Create Circle"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Existing Circles */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
          Your Circles ({circles.length})
        </h2>

        {circles.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No circles yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Create your first circle to get started
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Circle
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {circles.map((circle) => (
              <div
                key={circle.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                {/* Circle Banner Image */}
                {circle.banner_image && (
                  <div className="h-32 w-full mb-4 rounded-lg overflow-hidden">
                    <img
                      src={circle.banner_image}
                      alt={circle.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="flex justify-between items-start mb-4">
                  {/* Circle Icon + Name */}
                  <div className="flex-1 flex items-center">
                    {circle.icon_image ? (
                      <div className="h-10 w-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                        <img
                          src={circle.icon_image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 flex items-center justify-center mr-3 flex-shrink-0">
                        {circle.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {circle.name}
                      </h3>
                      {circle.description && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                          {circle.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-1 ml-4">
                    <button
                      onClick={() => startEditing(circle)}
                      className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded"
                      title="Edit Circle"
                      aria-label="Edit Circle"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteCircle(circle.id)}
                      className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                      title="Delete Circle"
                      aria-label="Delete Circle"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Circle Stats */}
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{circle.member_count || 0} members</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{circle.visibility || "public"}</span>
                  </div>
                </div>

                {/* Join Questions Preview */}
                {circle.join_questions && circle.join_questions.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Join Questions ({circle.join_questions.length})
                    </h4>
                    <ul className="space-y-1">
                      {circle.join_questions.slice(0, 2).map((q, index) => (
                        <li
                          key={index}
                          className="text-xs text-gray-600 dark:text-gray-400 truncate"
                        >
                          {index + 1}. {q.question}
                        </li>
                      ))}
                      {circle.join_questions.length > 2 && (
                        <li className="text-xs text-gray-500 dark:text-gray-500">
                          +{circle.join_questions.length - 2} more...
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Creation Date */}
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                  Created {new Date(circle.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
