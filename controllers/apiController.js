// Controller for GET /api/hello
exports.getHello = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Hello from the Frontyre Backend!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller for POST /api/data
exports.postData = (req, res) => {
  try {
    const { name, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide both name and message' 
      });
    }

    // Normally you would save this to a database here
    res.status(201).json({
      success: true,
      data: {
        id: Math.floor(Math.random() * 1000), // Mock ID
        name,
        message,
        receivedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
