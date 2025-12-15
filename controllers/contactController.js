// controllers/contactController.js
import Contact from '../models/Contact.js';

// @route   GET /api/contact
// @desc    Get all contact messages (PROTECTED - owner only)
export const getAllContacts = async (req, res, next) => {
  try {
    const { status } = req.query;
    let filter = { portfolioOwner: req.user._id }; // Only get messages for this user

    if (status) filter.status = status;

    const contacts = await Contact.find(filter)
      .sort('-createdAt')
      .populate('portfolioOwner', 'name email');
    
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/contact/:id
// @desc    Get single contact message (PROTECTED - owner only)
export const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    // Check if contact message belongs to the logged-in user
    if (contact.portfolioOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this message' });
    }
    
    // Mark as read
    if (contact.status === 'new') {
      contact.status = 'read';
      await contact.save();
    }
    
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/contact
// @desc    Create contact message (PUBLIC)
// @note    Anyone can send a message, but must specify which portfolio owner
export const createContact = async (req, res, next) => {
  try {
    const { portfolioOwner, name, email, subject, message, phone, company } = req.body;

    // Validate required fields
    if (!portfolioOwner || !name || !email || !subject || !message) {
      return res.status(400).json({ 
        message: 'Please provide portfolioOwner, name, email, subject, and message' 
      });
    }

    const contact = await Contact.create({
      portfolioOwner,
      name,
      email,
      subject,
      message,
      phone,
      company
    });
    
    res.status(201).json({
      message: 'Message sent successfully',
      contact: {
        _id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        createdAt: contact.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/contact/:id
// @desc    Update contact message status (PROTECTED - owner only)
export const updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    // Check if contact message belongs to the logged-in user
    if (contact.portfolioOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this message' });
    }
    
    contact.status = req.body.status || contact.status;
    contact.replied = req.body.replied || contact.replied;
    contact.replyMessage = req.body.replyMessage || contact.replyMessage;
    
    if (req.body.replied) {
      contact.replyDate = Date.now();
    }
    
    const updatedContact = await contact.save();
    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/contact/:id
// @desc    Delete contact message (PROTECTED - owner only)
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    // Check if contact message belongs to the logged-in user
    if (contact.portfolioOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }
    
    await contact.deleteOne();
    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};