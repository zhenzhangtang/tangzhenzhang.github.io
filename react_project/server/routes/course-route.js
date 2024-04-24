const router = require("express").Router();
const Course = require("../models").courseModel;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("A request is coming");
  next();
});

//find all courese and realted info

router.get("/", (req, res) => {
  Course.find({})
    .populate("instructor", ["username", "email"])
    //populate username and email of instructor
    //polulate make connection of data from different collections
    .then((course) => {
      res.send(course);
    })
    .catch(() => {
      res.status(500).send("Opus! Cannot get any course!!");
    });
});

//base on id to find course
router.get("/instructor/:_instructor_id", (req, res) => {
  let { _instructor_id } = req.params;
  Course.find({ instructor: _instructor_id })
    .populate("instructor", ["username", "email"])
    .then((data) => {
      res.send(data);
    })
    .catch(() => {
      res.status(500).send("Cannot get course data.");
    });
});

router.get("/findByName/:name", (req, res) => {
  let { name } = req.params;
  Course.find({ title: name })
    .populate("instructor", ["username", "email"])
    .then((course) => {
      res.status(200).send(course);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get("/student/:_student_id", (req, res) => {
  let { _student_id } = req.params;
  Course.find({ students: _student_id })
    .populate("instructor", ["username", "email"])
    .then((courses) => {
      res.status(200).send(courses);
    })
    .catch(() => {
      res.status(500).send("Cannot get data.");
    });
});

router.get("/:_id", (req, res) => {
  let { _id } = req.params;
  Course.findOne({ _id })
    .populate("instructor", ["email"])
    .then((course) => {
      res.send(course);
    })
    .catch((e) => {
      res.send(e);
    });
});

router.post("/enroll/:_id", async (req, res) => {
  let { _id } = req.params;
  let { user_id } = req.body;
  try {
    let course = await Course.findOne({ _id });
    course.students.push(user_id);
    await course.save();
    res.send("Enoll Successfully .");
  } catch (err) {
    res.send(err);
  }
});
//when instructer post a course, check inputs first
router.post("/", async (req, res) => {
  console.log("WE are herere....");
  // validate the inputs before making a new course
  const { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { title, description, price } = req.body;
  if (req.user.isStudent()) {
    return res
      .status(400)
      .send("Only the registerd instructor can post a course.");
  }

  let newCourse = new Course({
    title,
    description,
    price,
    instructor: req.user._id,
  });

  try {
    await newCourse.save();
    res.status(200).send("Successfully! A new course has been saved.");
  } catch (err) {
    res.status(400).send("Opus! Something went wrong. We cannot save course.");
  }
});

router.patch("/:_id", async (req, res) => {
  // validate the inputs before making a new course
  const { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { _id } = req.params;
  let course = await Course.findOne({ _id });
  if (!course) {
    res.status(404);
    return res.json({
      success: false,
      message: "The course is not found.",
    });
  }
  //only instructor who post the course or admin can update
  if (course.instructor.equals(req.user._id) || req.user.isAdmin()) {
    Course.findOneAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
    })
      .then(() => {
        res.send("Course already updated.");
      })
      .catch((e) => {
        res.send({
          success: false,
          message: e,
        });
      });
  } else {
    //if you are not with  above two conditions
    res.status(403);
    return res.json({
      success: false,
      message:
        "Sorry,no permission,only the instructor of the course or admin could update the course",
    });
  }
});

//delete course
router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  let course = await Course.findOne({ _id });
  if (!course) {
    res.status(404);
    return res.json({
      success: false,
      message: "The course is not found.",
    });
  }

  if (course.instructor.equals(req.user._id) || req.user.isAdmin()) {
    Course.deleteOne({ _id })
      .then(() => {
        res.send("The Course has been deleted.");
      })
      .catch((e) => {
        res.send({
          success: false,
          message: e,
        });
      });
  } else {
    res.status(403);
    return res.json({
      success: false,
      message:
        "Sorry,no permission,only the instructor of the course or admin could delete the course",
    });
  }
});
module.exports = router;
