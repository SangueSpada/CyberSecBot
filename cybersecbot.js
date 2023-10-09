require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const botoptions= {polling: true}
let bot = new TelegramBot(process.env.TG_BOT, botoptions);



//general message options
var general_links={
    bando_iscrizione:'https://corsidilaurea.uniroma1.it/sites/default/files/documenti_ufficiali/2023/169/29389_i.pdf',
    study_plan:'https://cybersecurity.uniroma1.it/study-plan',
    materiale:'https://drive.google.com/drive/folders/1DMFMXfhPnS1ysvBLM4-13A4o47keHy4F?usp=sharing',
    MIUR_schools:'https://piattaformaenticert.pubblica.istruzione.it/pocl-piattaforma-enti-cert-web/elenco-enti-accreditati',
    self_declaration_english:'https://docs.google.com/document/d/1sr1MoIbFAuVMZ_MqrQO6qiqM9nSho8tsRyj8EwhmZG8/edit'
}

//answers
var verifica_dei_requisiti=`Every information regarding enrolling can be found [here.](${general_links.bando_iscrizione})
In general, the verification of the requirements is done during the graduation sessions in order to wait until new enrollees have obtained the bachelor degree. An email will be sent as confirmation.

If you are sure you will graduate within the October or December sessions, you can follow anyway the lectures even if you are not enrolled.

As English language verification you can attach an english exam done during the bachelor, an official English Certificate (>=B2) released by a MIUR recognized [school](${general_links.MIUR_schools}), or a self declaration by compiling and sending [this](${general_links.self_declaration_english}) module`;

var study_plan=`[Study plan](${general_links.study_plan}) can be submitted (or edited) from 15 September to 31 December thorugh INFOSTUD (GOMP platform) and is approved in this period.

YOU MUST BE ENROLLED TO SUBMIT THE STUDY PLAN, but you can anyway follow the lectures if you are sure you will graduate within the October or December sessions.

Prof Daniele Venturi is the responsible and can be contacted thorugh its email \`venturi@di.uniroma1.it\`. 

It is necessary to choose a total of 30 CFU. 18 CFU of them must be chosen among the exams of Cybersecurity course but it's NOT compulsory to choose them all from the same orientation. 12 CFU can be choosen (almost) freely.`

var esami_a_scelta=`The exams most chosen by Cybersecurity students are Practical Network Defense and Risk Management.

You can take the exams whenever you want but you cannot take them before the year and semester in which they are scheduled.

If you want to know more about what a course is like you can search for information on individual groups.`

var certificato_inglese=`As English language verification you can attach an english exam done during the bachelor, an official English Certificate (>=B2) released by a MIUR recognized [school](${general_links.MIUR_schools}), or a self declaration by compiling and sending [this](${general_links.self_declaration_english}) module`

var materiale=`Notes, recording, and other material relative to the courses of cybersecurity can be found [here](${general_links.materiale})`

startlink="t.me/CyberSecSapienzaBot?start="

bot.onText(/verifica dei requisiti/i, async (msg) => {
    const options= {parse_mode: "Markdown",reply_to_message_id: msg.message_id};
    console.log(msg);
    let text=verifica_dei_requisiti;
    if(msg.chat.type != "private"){
        let regex ="verifica_dei_requisiti";
        replyPrivate(msg,text,regex); 
    }
    else bot.sendMessage(msg.chat.id,text,options);
});

bot.onText(/piano di studi|study plan|percorso formativo/i, async (msg) => {
    const options= {parse_mode: "Markdown",reply_to_message_id: msg.message_id};
    console.log(msg);
    let text=study_plan;
    if(msg.chat.type != "private"){
        let regex ="piano_di_studi";
        await replyPrivate(msg,text,regex); 
    }
    else bot.sendMessage(msg.chat.id,text,options);
});

bot.onText(/esami a scelta|esami opzionali/i, async (msg) => {
    const options= {parse_mode: "Markdown",reply_to_message_id: msg.message_id};
    console.log(msg);
    let text=esami_a_scelta;
    if(msg.chat.type != "private"){
        let regex ="esami_a_scelta";
        await replyPrivate(msg,text,regex); 
    }
    else bot.sendMessage(msg.chat.id,text,options);
});

bot.onText(/B2/i, async (msg) => {
    const options= {parse_mode: "Markdown",reply_to_message_id: msg.message_id};
    console.log(msg);
    let text=certificato_inglese;
    if(msg.chat.type != "private"){
        let regex ="inglese";
        await replyPrivate(msg,text,regex); 
    }
    else bot.sendMessage(msg.chat.id,text,options);
});

bot.onText(/materiale|lezioni registrate|registrazioni/i, async (msg) => {
    const options= {parse_mode: "Markdown",reply_to_message_id: msg.message_id};
    console.log(msg)
    let text=materiale;
    if(msg.chat.type != "private"){
        let regex ="materiale"
        await replyPrivate(msg,text,regex); 
    }
    else bot.sendMessage(msg.chat.id,text,options);
});

bot.onText(/\/start/,async (msg) => {
    const options= {parse_mode: "Markdown",reply_to_message_id: msg.message_id};
    var text;
    if(msg.text.includes("verifica_dei_requisiti")) text=verifica_dei_requisiti;
    else if(msg.text.includes("piano_di_studi")) text=study_plan;
    else if(msg.text.includes("esami_a_scelta")) text=esami_a_scelta;
    else if(msg.text.includes("inglese")) text=certificato_inglese;
    else if(msg.text.includes("materiale")) text=materiale;
    else{
        text=`Hi! Write me a topic you want more information about. You can choose between
\`verifica dei requisiti\`
\`study plan\`
\`esami a scelta\`
\`materiale\`
\`B2\` (english certification)`;
    }
    bot.sendMessage(msg.chat.id,text,options);

});

async function replyPrivate(msg,text,regex){
    console.log(msg);
    const options= {parse_mode: "Markdown",reply_to_message_id: msg.message_id};
    try{
        userid=msg.from.id
        await bot.sendMessage(userid,text,{parse_mode: "Markdown"});
        let to_eliminate=await bot.sendMessage(msg.chat.id,"I wrote you in private!",options);
        setTimeout(() => bot.deleteMessage(to_eliminate.chat.id,to_eliminate.message_id), 10000)
    }
    catch{ //user did not started the bot
        userid=msg.from.id
        text=`Allow me to reply you in [private!](${startlink+regex})`;
        let to_eliminate= await bot.sendMessage(msg.chat.id,text,options);
        setTimeout(() => bot.deleteMessage(to_eliminate.chat.id,to_eliminate.message_id), 15000)
    }
}
/*
bot.onText('//i', (msg) => {
    const options= {parse_mode: "Markdown",reply_to_message_id: msg.message_id};
    console.log(msg)
    text='';
    bot.sendMessage(msg.chat.id,text,options);
});
*/
bot.on("polling_error", console.log);

console.log("Bot has started");