const router = require('express').Router();

const faker = require('faker');

const TestModel = require('../models/test');
const SectionModel = require('../models/section');
const QuestionModel = require('../models/question');


router.get('/test', (req, res, next) => {

    // Get All Questions
    TestModel.find({}, function (err, items) {
        if (err) {
            return res.json({
                success: false,
                message: err
            });
        } else {
            var test = { success: true, message:'Successfully loaded tests',tests: items };
            // x = JSON.parse(test.tests[0].sections[0])
            // console.log(JSON.parse(x.questions[0]));
            for (var j = 0; j < test.tests.length; j++) {
                for (var i = 0; i < test.tests[j].sections.length; i++) {
                    test.tests[j].sections[i] = JSON.parse(test.tests[j].sections[i]);
                     for (var k = 0; k < test.tests[j].sections[i].questions.length; k++) {
                         test.tests[j].sections[i].questions[k] = JSON.parse(test.tests[j].sections[i].questions[k]);
                     }
                }
            }
            res.json(test);
        }
    })

});

router.get('/test/:id', (req,res,next)=>{
    TestModel.find({ testid: req.params.id }, function (err, item){

        if (err) {
            return res.json({
                success: false,
                message: err
            });
        } else {
            var testitem = { success: true, message:'Successfully loaded tests',test: item };
            //console.log(testitem.test[0].sections)
            // x = JSON.parse(testitem.test[0])
            // console.log(JSON.parse(x.questions[0]));
                for (var i = 0; i < testitem.test[0].sections.length; i++) {
                    testitem.test[0].sections[i] = JSON.parse(testitem.test[0].sections[i]);
                     for (var k = 0; k < testitem.test[0].sections[i].questions.length; k++) {
                        testitem.test[0].sections[i].questions[k] = JSON.parse(testitem.test[0].sections[i].questions[k]);
                     }
                }
            res.json(testitem);
        }
    })
})


router.post('/test', (req, res, next) => {
    let test = new TestModel();
    test.findOne({ testid: req.body.testid }, (err, existingTest) => {
        if (existingTest) {
            res.json({
                success: false,
                message: 'Test with that Id already present'
            });
        } else {
            test.save();

            res.json({
                success: true,
                message: 'Successfully Added Test',
            });
        }
    });
})


router.get('/faker/test', (req, res, next) => {
    let test = new TestModel();
    test.testid = 2;
    for (i = 0; i < 3; i++) {
        let section = new SectionModel();
        section.sectionid = i;
        for (j = 0; j < 100; j++) {
            let Question = new QuestionModel();
            Question.question = faker.lorem.words();
            Question.option1 = faker.random.words();
            Question.option2 = faker.random.words();
            Question.option3 = faker.random.words();
            Question.option4 = faker.random.words();
            Question.answer = Math.floor((Math.random() * 4) + 1);
            section.questions.push(JSON.stringify(Question));
        }
        test.sections.push(JSON.stringify(section));
    }
    test.save();
    res.json({
        success: true,
        message: '1 test added'
    });
});
module.exports = router;