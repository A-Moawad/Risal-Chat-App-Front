function AddFriendForm() {
  return (
    <section className="bg-white w-full md:w-[50%] lg:w-[30%] h-[100vh] px-6 py-8 flex flex-col gap-6 shadow-lg rounded-lg">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800 text-center">
        Start a New Chat
      </h1>

      {/* Form */}
      <form className="flex flex-col gap-4">
        {/* Input Field */}
        <input
          type="email"
          placeholder="Enter user's email"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all"
        >
          Add Friend
        </button>
      </form>

      {/* Additional Text */}
      <p className="text-sm text-gray-600 text-center">
        Make sure the email is correct to connect seamlessly.
      </p>
    </section>
  );
}

export default AddFriendForm;
