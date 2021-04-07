const router = require("express").Router();
const Workout = require("../models/workout.js");
const { param } = require("./view.js");

// new workout
router.post("/api/workouts", (req, res) => {
  Workout.create({})
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/api/workouts", (req, res) => {
  Workout.find()
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.json(err);
    });
});

// new exercise 
router.put('/api/workouts/:id', ({ body, params }, res) => {
  Workout.findByIdAndUpdate(
    params.id,
    { $push: { exercises: body } },
    // "runValidators" will ensure new exercises meet our schema requirements
    { new: true, runValidators: true }
  )
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.json(err);
    });
});


// previous workouts 
router.get("/api/workouts/range", (req, res) => {
  Workout.aggregate([{
    $addFields: {
      totalDuration: { $sum: "$exercises.duration" }
    }
  }]).then(dbWorkout => {
    res.json(dbWorkout);
    Workout.find({})
      .then((dbWorkout) => {
        res.json(dbWorkout)
      })
  })
    .catch(err => {
      res.status(400).json(err);
    });
});

module.exports = router;
