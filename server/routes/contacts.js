const express = require('express');
const Contact = require('../models/contact');
const sequenceGenerator = require('./sequenceGenerator');
const router = express.Router();

// Function to return an error if one occurs, reduces code!
function returnError(res, err) {
  res.status(500).json({
    message: "An error occurred!",
    error: err
  });
}

router.get('/', (req, res, next) => {
  Contact.find().then(cons => {
    res.status(200).json({
      message: "Contacts fetched successfully!",
      contacts: cons
    });
  }).catch(err => {
    returnError(res, err);
  });
});

router.get('/:id', (req, res, next) => {
  Contact.findOne({
    "id": req.params.id
  }).populate('group').then(con => {
    res.status(200).json({
      message: "Contact fetched successfully!",
      contact: con
    });
  }).catch(err => {
    returnError(res, err);
  });
});

router.get('/', (req, res, next) => {
  Contact.find()
    .populate('group')
    .then(contacts => {
      res.status(200).json({
        message: 'Contacts fetched successfully!',
        contacts: contacts
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});


router.post('/', (req, res, next) => {
  const maxContactId = sequenceGenerator.nextId("contacts");

  console.log('before creating contact')

  const contact = new Contact({
    id: maxContactId,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    imageUrl: req.body.imageUrl,
    group: req.body.group
  });

  console.log('after creating contact')

  contact.save()
    .then(createdContact => {
      res.status(201).json({
        message: 'Contact added successfully',
        contact: createdContact
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

router.put('/:id', (req, res, next) => {
  Contact.findOne({
      id: req.params.id
    })
    .then(contact => {
      contact.name = req.body.name;
      contact.description = req.body.description;
      contact.url = req.body.url;

      Contact.updateOne({
          id: req.params.id
        }, contact)
        .then(result => {
          res.status(204).json({
            message: 'Contact updated successfully'
          })
        })
        .catch(error => {
          res.status(500).json({
            message: 'An error occurred',
            error: error
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Contact not found.',
        error: {
          contact: 'Contact not found'
        }
      });
    });
});

router.delete("/:id", (req, res, next) => {
  Contact.findOne({
      id: req.params.id
    })
    .then(contact => {
      Contact.deleteOne({
          id: req.params.id
        })
        .then(result => {
          res.status(204).json({
            message: "Contact deleted successfully"
          });
        })
        .catch(error => {
          res.status(500).json({
            message: 'An error occurred',
            error: error
          });
        })
    })
    .catch(error => {
      res.status(500).json({
        message: 'contact not found.',
        error: {
          contact: 'contact not found'
        }
      });
    });
});

router.get('/', (req, res, next) => {
  Contact.find()
    .populate('group')
    .then(contacts => {
      res.status(200).json({
        message: 'Contacts fetched successfully!',
        contacts: contacts
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

module.exports = router;
