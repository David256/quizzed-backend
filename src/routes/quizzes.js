const log = require('npmlog');
const express = require('express');
const { v4: uuid } = require('uuid');

const router = express.Router();

router.get('/quizzes', (req, res) => {});

router.post('/quizzes', (req, res) => {});

router.put('/quizzes', (req, res) => {});

router.delete('/quizzes', (req, res) => {});

module.exports = router;
