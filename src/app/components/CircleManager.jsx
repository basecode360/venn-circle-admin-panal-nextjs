import React, { useState, useEffect, useMemo } from "react";
import { Plus, AlertCircle, Search } from "lucide-react";

// Import custom components
import SearchBar from './circle-management/SearchBar';
import CreateCircleForm from './circle-management/CreateCircleForm';
import EditCircleModal from './circle-management/EditCircleModal';
import CircleCard from './circle-management/CircleCard';

export default function CircleManagement({ user, supabase, onLogout }) {
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formError, setFormError] = useState("");
  const [editingCircle, setEditingCircle] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Form state
  const [circleName, setCircleName] = useState("");
  const [circleDescription, setCircleDescription] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [isFiltered, setIsFiltered] = useState(false);
  const [bannerImage, setBannerImage] = useState("");
  const [iconImage, setIconImage] = useState("");
  const [questions, setQuestions] = useState([
    {
      id: "1",
      question: "",
      answers: ["", "", "", ""],
      correctAnswer: 0,
    },
  ]);

  // Handle visibility change
  const handleVisibilityChange = (value) => {
    setVisibility(value);
  };

  // Handle filtered change
  const handleFilteredChange = (checked) => {
    setIsFiltered(checked);

    const storageKey = editingCircle
      ? `circle_questions_${editingCircle.id}`
      : "new_circle_questions";

    if (checked) {
      const savedQuestions = localStorage.getItem(storageKey);
      if (savedQuestions) {
        try {
          const parsedQuestions = JSON.parse(savedQuestions);
          setQuestions(parsedQuestions);
        } catch (error) {
          console.error("Error parsing saved questions:", error);
          setQuestions([
            {
              id: "1",
              question: "",
              answers: ["", "", "", ""],
              correctAnswer: 0,
            },
          ]);
        }
      } else if (!questions || questions.length === 0) {
        setQuestions([
          {
            id: "1",
            question: "",
            answers: ["", "", "", ""],
            correctAnswer: 0,
          },
        ]);
      }
    } else {
      if (questions.length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(questions));
      }
      setQuestions([]);
    }
  };

  // Handle image uploads
  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const base64String = reader.result;
          if (type === "banner") {
            setBannerImage(base64String);
          } else if (type === "icon") {
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
        correctAnswer: 0,
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

  // Set correct answer for a question
  const setCorrectAnswer = (questionIndex, answerIndex) => {
    const updated = [...questions];
    updated[questionIndex].correctAnswer = answerIndex;
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
    setIsFiltered(false);
    setBannerImage("");
    setIconImage("");
    setQuestions([]);
    setEditingCircle(null);
    setShowForm(false);
    setShowEditModal(false);
    setFormError("");

    localStorage.removeItem('new_circle_questions');
    if (editingCircle) {
      localStorage.removeItem(`circle_questions_${editingCircle.id}`);
    }
  };

  // Edit circle
  const startEditing = (circle) => {
    setEditingCircle(circle);
    setCircleName(circle.name);
    setCircleDescription(circle.description || "");
    setVisibility(circle.visibility || "public");
    setIsFiltered(circle.is_filtered || false);
    setBannerImage(circle.banner_image || "");
    setIconImage(circle.icon_image || "");

    if (
      circle.is_filtered &&
      circle.join_questions &&
      circle.join_questions.length > 0
    ) {
      const loadedQuestions = circle.join_questions.map((q, index) => ({
        id: q.id || (index + 1).toString(),
        question: q.question || "",
        answers: q.answers
          ? q.answers.map((a) => a.text || "")
          : ["", "", "", ""],
        correctAnswer: q.answers ? q.answers.findIndex(a => a.is_correct) || 0 : 0,
      }));
      setQuestions(loadedQuestions);
    } else if (circle.is_filtered) {
      setQuestions([{ id: "1", question: "", answers: ["", "", "", ""], correctAnswer: 0 }]);
    } else {
      setQuestions([]);
    }

    setShowEditModal(true);
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
    if (!circleName.trim()) {
      setFormError("Circle name is required");
      return false;
    }

    if (isFiltered) {
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
        is_correct: aIndex === q.correctAnswer,
      })),
    }));
  };

  // Filter circles based on search term
  const filteredCircles = useMemo(() => {
    if (!searchTerm.trim()) {
      return circles;
    }

    return circles.filter(
      (circle) =>
        circle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (circle.description &&
          circle.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [circles, searchTerm]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!supabase) {
      console.error("Supabase client is not available");
      setFormError("Database connection not available");
      return;
    }

    if (!validateForm()) return;

    const formattedQuestions = isFiltered ? formatQuestionsForDb() : [];

    try {
      setSubmitting(true);

      if (editingCircle) {
        const { error } = await supabase
          .from("circles")
          .update({
            name: circleName.trim(),
            description: circleDescription.trim(),
            visibility: visibility,
            is_filtered: isFiltered,
            banner_image: bannerImage,
            icon_image: iconImage,
            join_questions: formattedQuestions,
          })
          .eq("id", editingCircle.id);

        if (error) throw error;
        alert("Circle updated successfully!");

        localStorage.removeItem(`circle_questions_${editingCircle.id}`);
      } else {
        const circleData = {
          name: circleName.trim(),
          description: circleDescription.trim(),
          visibility: visibility,
          is_filtered: isFiltered,
          banner_image: bannerImage,
          icon_image: iconImage,
          join_questions: formattedQuestions,
          member_count: 1,
          is_official: false,
          auto_join: false,
        };

        const { error } = await supabase.from("circles").insert([circleData]);

        if (error) throw error;
        alert("Circle created successfully!");

        localStorage.removeItem('new_circle_questions');
      }

      resetForm();
      loadCircles();
    } catch (error) {
      console.error("Error submitting circle:", error);
      setFormError("Error saving circle: " + error.message);
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

      {/* Search Bar */}
      <SearchBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredCount={filteredCircles.length}
      />

      {/* Error Display */}
      {formError && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          <p>{formError}</p>
        </div>
      )}

      {/* Create Circle Form */}
      {showForm && (
        <CreateCircleForm
          circleName={circleName}
          setCircleName={setCircleName}
          circleDescription={circleDescription}
          setCircleDescription={setCircleDescription}
          visibility={visibility}
          handleVisibilityChange={handleVisibilityChange}
          isFiltered={isFiltered}
          handleFilteredChange={handleFilteredChange}
          bannerImage={bannerImage}
          setBannerImage={setBannerImage}
          iconImage={iconImage}
          setIconImage={setIconImage}
          handleImageUpload={handleImageUpload}
          questions={questions}
          updateQuestion={updateQuestion}
          updateAnswer={updateAnswer}
          setCorrectAnswer={setCorrectAnswer}
          addQuestion={addQuestion}
          removeQuestion={removeQuestion}
          handleSubmit={handleSubmit}
          submitting={submitting}
          resetForm={resetForm}
        />
      )}

      {/* Edit Circle Modal */}
      <EditCircleModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        circleName={circleName}
        setCircleName={setCircleName}
        circleDescription={circleDescription}
        setCircleDescription={setCircleDescription}
        visibility={visibility}
        handleVisibilityChange={handleVisibilityChange}
        isFiltered={isFiltered}
        handleFilteredChange={handleFilteredChange}
        bannerImage={bannerImage}
        setBannerImage={setBannerImage}
        iconImage={iconImage}
        setIconImage={setIconImage}
        handleImageUpload={handleImageUpload}
        questions={questions}
        updateQuestion={updateQuestion}
        updateAnswer={updateAnswer}
        setCorrectAnswer={setCorrectAnswer}
        addQuestion={addQuestion}
        removeQuestion={removeQuestion}
        handleSubmit={handleSubmit}
        submitting={submitting}
      />

      {/* Existing Circles */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
          {searchTerm
            ? `Search Results (${filteredCircles.length})`
            : `Your Circles (${circles.length})`}
        </h2>

        {filteredCircles.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-gray-400 mb-4">
              {searchTerm ? (
                <Search className="mx-auto h-16 w-16" />
              ) : (
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
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm
                ? `No circles found for "${searchTerm}"`
                : "No circles yet"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm
                ? "Try searching with different keywords or clear the search to see all circles"
                : "Create your first circle to get started"}
            </p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm("")}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors mr-2"
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Circle
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCircles.map((circle) => (
              <CircleCard
                key={circle.id}
                circle={circle}
                onEdit={startEditing}
                onDelete={deleteCircle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
