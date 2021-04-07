var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Message = require('../models/message');


router.get('/', (req, res, next) => {
  Message.find()
    .populate('sender')
    .then(mess => {
      res.status(200).json({
        message: "Messages fetched successfully!",
        messages: mess
      });
    }).catch(err => {
      console.log(err)
      res.status(500).json({
        message: "An error occurred!",
        error: err
      });
    });
});

router.get('/:id', (req, res, next) => {
  Message.findOne({
      "id": req.params.id
    })
    .then(mes => {
      res.status(200).json({
        message: "Message fetched successfully!",
        messages: mes
      });
    }).catch(err => {
      res.status(500).json({
        message: "An error occurred!",
        error: err
      });
    });
});

router.post('/', (req, res, next) => {
  const maxMessageId = sequenceGenerator.nextId("messages");

  const message = new Message({
    id: maxMessageId,
    subject: req.body.subject,
    msgText: req.body.msgText,
    sender: req.body.sender
  });

  message.save()
    .then(createdMessage => {
      res.status(201).json({
        message: 'Message added successfully',
        msg: createdMessage
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
  Message.findOne({
      id: req.params.id
    })
    .then(message => {
      message.name = req.body.name;
      message.description = req.body.description;
      message.url = req.body.url;

      Message.updateOne({
          id: req.params.id
        }, document)
        .then(result => {
          res.status(204).json({
            message: 'Message updated successfully'
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
        message: 'Document not found.',
        error: {
          document: 'Document not found'
        }
      });
    });
});

router.delete("/:id", (req, res, next) => {
  Message.findOne({
      id: req.params.id
    })
    .then(message => {
      message.deleteOne({
          id: req.params.id
        })
        .then(result => {
          res.status(204).json({
            message: "Message deleted successfully"
          });
        })
        .catch(error => {
          res.status(500).json({
            message: 'Message(An error occurred)',
            error: error
          });
        })
    })
    .catch(error => {
      res.status(500).json({
        message: 'Message not found.',
        error: {
          message: 'Message not found'
        }
      });
    });
});
module.exports = router;
