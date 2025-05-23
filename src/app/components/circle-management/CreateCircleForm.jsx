import React from 'react';
import ImageUpload from './ImageUpload';
import QuestionForm from './QuestionForm';

const CreateCircleForm = ({
  circleName,
  setCircleName,
  circleDescription,
  setCircleDescription,
  visibility,
  handleVisibilityChange,
  isFiltered,
  handleFilteredChange,
  bannerImage,
  setBannerImage,
  iconImage,
  setIconImage,
  handleImageUpload,
  questions,
  updateQuestion,
  updateAnswer,
  setCorrectAnswer,
  addQuestion,
  removeQuestion,
  handleSubmit,
  submitting,
  resetForm
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
        Create New Circle
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
                onChange={() => handleVisibilityChange("public")}
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
                onChange={() => handleVisibilityChange("private")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                Private
              </span>
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Choose circle visibility (Public or Private)
          </p>
        </div>

        {/* Filtered Setting */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Circle Settings
          </label>
          <div className="flex items-center">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isFiltered}
                onChange={(e) => handleFilteredChange(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                Filtered Circle
              </span>
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {isFiltered
              ? "This circle will have join questions and content filtering enabled"
              : "This circle will not have join questions or content filtering"}
          </p>
        </div>

        {/* Image Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUpload
            type="banner"
            image={bannerImage}
            setImage={setBannerImage}
            handleImageUpload={handleImageUpload}
            label="Banner Image"
          />
          <ImageUpload
            type="icon"
            image={iconImage}
            setImage={setIconImage}
            handleImageUpload={handleImageUpload}
            label="Icon Image"
          />
        </div>

        {/* Questions Section - Only visible for filtered circles */}
        {isFiltered && (
          <QuestionForm
            questions={questions}
            updateQuestion={updateQuestion}
            updateAnswer={updateAnswer}
            setCorrectAnswer={setCorrectAnswer}
            addQuestion={addQuestion}
            removeQuestion={removeQuestion}
            prefix="create-"
          />
        )}

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
            {submitting ? "Creating..." : "Create Circle"}
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
  );
};

export default CreateCircleForm;