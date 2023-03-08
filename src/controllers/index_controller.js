const { Pool } = require("pg");
const config = {
  user: "appvirtual",
  host: "172.16.4.74",
  password: "7a7$43PhRaM!",
  database: "moodlev3",
  post: "5432",
};

const conect = new Pool(config);

//condicion filtros like
like = `(mc.fullname like '%V2%' or mc.fullname like '%V1%') `

const get_last_conect_teacher = async (req, res) => {
  try {
    let SELECT1 =
      `select distinct mc.fullname as Curso, (mu.firstname || ' ' || mu.lastname)as Docente,
      mu.email as correo, now()::date - to_timestamp(lastlogin)::date as Ultimo_Acceso from mdl_user mu 
      inner join mdl_role_assignments mra on (mu.id  = mra.userid)
      inner join mdl_context mct on (mra.contextid = mct.id)
      inner join mdl_course mc on (mct.instanceid = mc.id)
      INNER JOIN mdl_course_categories mcc on ( mc.category =mcc.id ) 
      where mra.roleid = 3 and mc.visible=1 and ${like} order by Curso`;
    let response1 = await conect.query(SELECT1);
    res.status(200).json(response1.rows);
    //console.log(response1.rows);
  } catch (e) {
    console.log(e);
  }
};

const get_user_whit_long_disconect_time = async (req, res) => {
  try {
    let SELECT2 =
      `SELECT DISTINCT mc.fullname as Curso,( mu.firstname|| ' ' ||mu.lastname) as Estudiente,
      mu.email AS email,now()::date - to_timestamp(lastlogin)::date AS days 
      FROM mdl_user_enrolments mue JOIN mdl_user mu on (mue.userid = mu.id) 
      JOIN mdl_role_assignments mra ON ( mu.id = mra.userid ) 
      JOIN mdl_context mc1 ON ( mra.contextid = mc1.id ) 
      JOIN mdl_course mc ON ( mc1.instanceid = mc.id )
      JOIN mdl_course_categories mcc ON ( mc.category = mcc.id )
      where mc.visible= 1 and mue.status =0 and NOW()- interval '7 DAYS'>to_timestamp(lastlogin)
      and to_timestamp(mc.startdate) < to_timestamp(lastlogin) and mu.deleted=0
      and mra.roleid =5 and ${like} order by Curso`;
    let response2 = await conect.query(SELECT2);
    res.status(200).json(response2.rows);
    //console.log(response2.rows);
  } catch (e) {
    console.log(e);
  }
};

const get_user_never_conect_course = async (req, res) => {
  try {
    let SELECT3 =
      `SELECT DISTINCT mc.shortname as Curso, ( mu.firstname|| ' ' ||mu.lastname) as nombre,
      mu.email AS email FROM mdl_user mu 
      join mdl_role_assignments mra on (mu.id = mra.userid)
      join mdl_context mct on (mra.contextid= mct.id)
      join mdl_course mc on (mct.instanceid = mc.id)
      join mdl_course_categories mcc on (mc.category = mcc.id)
      where to_timestamp(mc.startdate) > to_timestamp(lastlogin) and mc.visible=1
      and ${like} order by Curso`;
    let response3 = await conect.query(SELECT3);
    res.status(200).json(response3.rows);
    //console.log(response3.rows);
  } catch (e) {
    console.log(e);
  }
};

const get_studens_for_course = async (req, res) => {
  try {
    let SELECT4 =
      `SELECT  mc.fullname, COUNT(distinct ue.id) AS estudiantes 
      FROM mdl_course mc JOIN mdl_enrol AS en ON en.courseid = mc.id 
      JOIN mdl_user_enrolments ue ON ue.enrolid = en.id 
      inner join mdl_user mu on (ue.userid = mu.id)
      inner JOIN mdl_role_assignments mra ON ( mu.id = mra.userid ) 
      where mc.visible =1  and ${like} and ue.status =0 and mra.roleid =5 and mu.deleted =0
      and mu.id not in (SELECT DISTINCT mdl_user.id FROM mdl_user
      INNER JOIN mdl_role_assignments ON ( mdl_user.id = mdl_role_assignments.userid ) 
      INNER JOIN mdl_context ON ( mdl_role_assignments.contextid = mdl_context.id )
      INNER JOIN mdl_course ON ( mdl_context.instanceid = mdl_course.id )
      INNER JOIN mdl_course_categories ON ( mdl_course.category = mdl_course_categories.id ) 
      where mdl_role_assignments.roleid = 3  and mdl_course.visible= 1
      and ${like}) GROUP BY mc.fullname ORDER BY mc.fullname`;
    let response4 = await conect.query(SELECT4);
    res.status(200).json(response4.rows);
    //console.log(response4.length);
  } catch (e) {
    console.log(e);
  }
};

const get_teacheEvaluation_for_course = async (req, res) => {
  try {
    let SELECT5 =
      `select mc.fullname as curso , count(distinct fc.id) as estudiatnes_presentaron,COUNT(distinct ue.id)as registrados, (COUNT(distinct ue.id)-count(distinct fc.id))as faltantes
      from mdl_feedback f inner join mdl_feedback_completed fc on (f.id = fc.feedback) 
      inner join mdl_course mc on (f.course = mc.id) 
      inner jOIN mdl_enrol en ON (en.courseid = mc.id)
      inner join mdl_user_enrolments ue ON (ue.enrolid = en.id) 
      inner join mdl_user mu on (ue.userid = mu.id)
      inner JOIN mdl_role_assignments mra ON ( mu.id = mra.userid )
      where mc.visible =1 and ${like} and ue.status =0 and mra.roleid =5 and mu.deleted =0
      and mu.id not in (select distinct mu.id from mdl_user mu 
      inner join mdl_role_assignments mra on (mu.id  = mra.userid)
      inner join mdl_context mct on (mra.contextid = mct.id)
      inner join mdl_course mc on (mct.instanceid = mc.id)
      INNER JOIN mdl_course_categories mcc on ( mc.category =mcc.id ) 
      where mra.roleid = 3 and mc.visible=1 and ${like})
      group by curso order by curso`;
    let response5 = await conect.query(SELECT5);

    let complement =
      `select distinct mc.fullname as curso, (mu.firstname || ' ' || mu.lastname)as Docente,
      mu.email as correo, now()::date - to_timestamp(lastlogin)::date as Ultimo_Acceso from mdl_user mu 
      inner join mdl_role_assignments mra on (mu.id  = mra.userid)
      inner join mdl_context mct on (mra.contextid = mct.id)
      inner join mdl_course mc on (mct.instanceid = mc.id)
      INNER JOIN mdl_course_categories mcc on ( mc.category =mcc.id ) 
      where mra.roleid = 3 and mc.visible=1 and ${like} order by curso`;
    let complement1 = await conect.query(complement);

    let temp1 = (complement1.rows);
    let temp = (response5.rows);
    let data = []
    for (let i = 0; i < temp.length; i++) {      
      for (let j = 0; j < temp1.length; j++) {
        if (temp[i].curso === temp1[j].curso) {
          data.push({ "curso": `${temp[i].curso}`, "correo": `${temp1[j].correo}`, "estudiatnes_presentaron": `${parseInt(temp[i].estudiatnes_presentaron, 10)}`, "registrados": `${parseInt(temp[i].registrados, 10)}`, "faltantes": `${parseInt(temp[i].faltantes, 10)}` });
        }
      }
    }
    //console.log(data);
    res.status(200).json(data);
  } catch (e) {
    console.log(e);
  }
};

const get_number_accecs_for_user_to_plataform_m = async (req, res) => {
  try {
    let SELECT6_1 =
      `SELECT COUNT(u.id), u.username, ( u.firstname|| ' ' ||u.lastname) as nombre
      FROM mdl_logstore_standard_log l INNER JOIN mdl_user u ON u.id = l.userid 
      WHERE l.component = 'core' AND l.action = 'loggedin' and deleted=0 
      and NOW()- interval '30 DAYS'<to_timestamp(l.timecreated)  
      GROUP BY u.username,u.firstname, u.firstname, u.lastname`;
    let response6_1 = await conect.query(SELECT6_1);
    res.status(200).json(response6_1.rows);
    //console.log(response6.rows);
  } catch (e) {
    console.log(e);
  }
};
const get_number_accecs_for_user_to_plataform_t = async (req, res) => {
  try {
    let SELECT6_2 =
      `SELECT COUNT(u.id), u.username, ( u.firstname|| ' ' ||u.lastname) as nombre
      FROM mdl_logstore_standard_log l INNER JOIN mdl_user u ON u.id = l.userid 
      WHERE l.component = 'core' AND l.action = 'loggedin' and deleted=0 
      and NOW()- interval '91 DAYS'<to_timestamp(l.timecreated)  
      GROUP BY u.username,u.firstname, u.firstname, u.lastname`;
    let response6_2 = await conect.query(SELECT6_2);
    res.status(200).json(response6_2.rows);
    //console.log(response6.rows);
  } catch (e) {
    console.log(e);
  }
};
const get_number_accecs_for_user_to_plataform_s = async (req, res) => {
  try {
    let SELECT6_3 =
      `SELECT COUNT(u.id), u.username, ( u.firstname|| ' ' ||u.lastname) as nombre
      FROM mdl_logstore_standard_log l INNER JOIN mdl_user u ON u.id = l.userid 
      WHERE l.component = 'core' AND l.action = 'loggedin' and deleted=0 
      and NOW()- interval '122 DAYS'<to_timestamp(l.timecreated)  
      GROUP BY u.username,u.firstname, u.firstname, u.lastname`;
    let response6_3 = await conect.query(SELECT6_3);
    res.status(200).json(response6_3.rows);
    //console.log(response6.rows);
  } catch (e) {
    console.log(e);
  }
};


const get_user_never_conect_any_course = async (req, res) => {
  try {
    let SELECT7 =
      `select distinct  ( mu.firstname|| ' ' ||mu.lastname) as nombre,
      mu.email AS email FROM mdl_user mu 
      join mdl_role_assignments mra on (mu.id = mra.userid)
      join mdl_context mct on (mra.contextid= mct.id)
      join mdl_course mc on (mct.instanceid = mc.id)
      join mdl_course_categories mcc on (mc.category = mcc.id)
      where mc.visible =1 and ${like} 
      and mu.deleted = 0 and mu.id  not in (select distinct u.id FROM mdl_logstore_standard_log l 
      INNER JOIN mdl_user u ON u.id = l.userid WHERE l.component = 'core' AND l.action = 'loggedin' and deleted=0)`;
    let response7 = await conect.query(SELECT7);
    res.status(200).json(response7.rows);
    //console.log(response7.rows);
  } catch (e) {
    console.log(e);
  }
};

const get_total_teacheEvaluation_missing = async (req, res) => {
  try {
    let SELECT4_1 =
      `select (COUNT(distinct ue.id)-count(distinct fc.id))as faltantes, count(distinct fc.id) as total
      from mdl_feedback f inner join mdl_feedback_completed fc on (f.id = fc.feedback) 
      inner join mdl_course mc on (f.course = mc.id) 
      inner jOIN mdl_enrol en ON (en.courseid = mc.id)
      inner join mdl_user_enrolments ue ON (ue.enrolid = en.id) 
      inner join mdl_user mu on (ue.userid = mu.id)
      inner JOIN mdl_role_assignments mra ON ( mu.id = mra.userid )
      where mc.visible =1 and ${like} and ue.status =0 and mra.roleid =5 and mu.deleted =0
      and mu.id not in (SELECT DISTINCT mdl_user.id FROM mdl_user
      INNER JOIN mdl_role_assignments ON ( mdl_user.id = mdl_role_assignments.userid ) 
      INNER JOIN mdl_context ON ( mdl_role_assignments.contextid = mdl_context.id )
      INNER JOIN mdl_course ON ( mdl_context.instanceid = mdl_course.id )
      INNER JOIN mdl_course_categories ON ( mdl_course.category = mdl_course_categories.id ) 
      where mdl_role_assignments.roleid = 3  and mdl_course.visible= 1
      and ${like})`;
    let response4_1 = await conect.query(SELECT4_1);
    res.status(200).json(response4_1.rows);
    //console.log(response7.rows);
  } catch (e) {
    console.log(e);
  }
};

const home = async (req, res) => {
  try {
    res.status(200).json({ title: "hola mundo" });
    //console.log(response7.rows);
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  get_user_whit_long_disconect_time,
  get_last_conect_teacher,
  get_user_never_conect_course,
  get_teacheEvaluation_for_course,
  get_number_accecs_for_user_to_plataform_m,
  get_number_accecs_for_user_to_plataform_t,
  get_number_accecs_for_user_to_plataform_s,
  get_user_never_conect_any_course,
  get_studens_for_course,
  get_total_teacheEvaluation_missing,
  home,
};
