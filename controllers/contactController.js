// ================================================================
// controllers/contactController.js
// ================================================================
import Contact from '../models/Contact.js';

// @route   GET /api/contact
// @desc    Get all contact messages (admin only)
export const getAllContacts = async (req, res, next) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status) filter.status = status;

    const contacts = await Contact.find(filter).sort('-createdAt');
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/contact/:id
// @desc    Get single contact message
export const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
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
// @desc    Create contact message
export const createContact = async (req, res, next) => {
  try {
    const { name, email, subject, message, phone, company } = req.body;

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      phone,
      company
    });
    
    res.status(201).json({
      message: 'Message sent successfully',
      contact
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/contact/:id
// @desc    Update contact message status
export const updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
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
// @desc    Delete contact message
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    
    await contact.deleteOne();
    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};