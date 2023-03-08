const {Router} = require('express')
const router = Router(); 

const { get_last_conect_teacher } = require('../controllers/index_controller');
const { get_user_whit_long_disconect_time} = require('../controllers/index_controller');
const { get_user_never_conect_course} = require('../controllers/index_controller');
const { get_teacheEvaluation_for_course}= require('../controllers/index_controller');
const { get_total_teacheEvaluation_missing}= require('../controllers/index_controller');
const { get_studens_for_course}= require('../controllers/index_controller');
const { get_number_accecs_for_user_to_plataform_m}= require('../controllers/index_controller');
const { get_number_accecs_for_user_to_plataform_s}= require('../controllers/index_controller');
const { get_number_accecs_for_user_to_plataform_t}= require('../controllers/index_controller');
const { get_user_never_conect_any_course} = require('../controllers/index_controller');
const { home} = require('../controllers/index_controller');

router.get('/',home);
router.get('/code1',get_last_conect_teacher);
router.get('/code2',get_user_whit_long_disconect_time);
router.get('/code3',get_user_never_conect_course);
router.get('/code4',get_teacheEvaluation_for_course);
router.get('/code4_1',get_total_teacheEvaluation_missing);
router.get('/code5',get_studens_for_course);
router.get('/code6_1',get_number_accecs_for_user_to_plataform_m);
router.get('/code6_2',get_number_accecs_for_user_to_plataform_t);
router.get('/code6_3',get_number_accecs_for_user_to_plataform_s);
router.get('/code7',get_user_never_conect_any_course);


module.exports = router;