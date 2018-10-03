var path = require("path");
var express = require("express");
var client = require('opentsdb-client')();
var mQuery = require('opentsdb-mquery')();
var sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');

client
    .host('35.240.2.119')
    .port(4242)
    .ms(true)
    .arrays(true)
    .tsuids(false)
    .annotations('all')

var mainRouter = express.Router();

mainRouter.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'views', 'landingPage.html'));
});

mainRouter.get("/about", function (req, res) {
    res.sendFile(path.join(__dirname, "views", "about.html"));
});

mainRouter.post("/dataQuery", function (req, res) {
    let start = req.body.start;
    let end = req.body.end;
    let frequency = req.body.frequency;
    let metric = req.body.metric;
    let result = [];

    if (!start || !end || !frequency || !metric) {
        return res.sendStatus(400);
    }

    for (let metric_index = 0; metric_index < metric.length; metric_index++) {
        mQuery
            .aggregator('avg')
            .downsample(frequency)
            .rate(false)
            .metric(metric[metric_index])
            .tags('DataLoggerName', metric[metric_index])

        client
            .start(start)
            .end(end)
            .queries(mQuery)
            .get(function onData(error, data) {
                if (error) {
                    console.error(JSON.stringify(error));
                    return;
                }
                result.push(data);
                if (result.length == metric.length) {
                    res.send(result);
                }
            });
        }
});

mainRouter.get('/metrics', function (req, res) {
    client.metrics(function onResponse(error, metrics) {
        if (error) {
            console.error(JSON.stringify(error));
            return;
        }
        res.send(metrics);
    });
});

mainRouter.get("*", function (req, res){
    res.redirect("/");
});

mainRouter.post('/submitReport', function (req, res) {
    let resource = req.body.resource;
    let location = req.body.location;
    let report = req.body.report;

    if (!resource || !location || !report) {
        return res.sendStatus(400);
    }

    let msg = {
        to: '704447@students.wits.ac.za',
        from: 'incidents@spatialwits.com',
        subject: 'A new resource wastage incident has been reported',
        text: 'text',
        html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/> <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"/> <meta http-equiv="X-UA-Compatible" content="IE=Edge"/><!--[if (gte mso 9)|(IE)]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--><!--[if (gte mso 9)|(IE)]> <style type="text/css"> body{width: 600px;margin: 0 auto;}table{border-collapse: collapse;}table, td{mso-table-lspace: 0pt;mso-table-rspace: 0pt;}img{-ms-interpolation-mode: bicubic;}</style><![endif]--> <style type="text/css"> body, p, div{font-family: helvetica,arial,sans-serif; font-size: 16px;}body{color: #000000;}body a{color: #1188E6; text-decoration: none;}p{margin: 0; padding: 0;}table.wrapper{width:100% !important; table-layout: fixed; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -moz-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}img.max-width{max-width: 100% !important;}.column.of-2{width: 50%;}.column.of-3{width: 33.333%;}.column.of-4{width: 25%;}@media screen and (max-width:480px){.preheader .rightColumnContent, .footer .rightColumnContent{text-align: left !important;}.preheader .rightColumnContent div, .preheader .rightColumnContent span, .footer .rightColumnContent div, .footer .rightColumnContent span{text-align: left !important;}.preheader .rightColumnContent, .preheader .leftColumnContent{font-size: 80% !important; padding: 5px 0;}table.wrapper-mobile{width: 100% !important; table-layout: fixed;}img.max-width{height: auto !important; max-width: 480px !important;}a.bulletproof-button{display: block !important; width: auto !important; font-size: 80%; padding-left: 0 !important; padding-right: 0 !important;}.columns{width: 100% !important;}.column{display: block !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; margin-left: 0 !important; margin-right: 0 !important;}}</style> </head> <body> <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size: 16px; font-family: helvetica,arial,sans-serif; color: #000000; background-color: #ebebeb;"> <div class="webkit"> <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#ebebeb"> <tr> <td valign="top" bgcolor="#ebebeb" width="100%"> <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0"> <tr> <td width="100%"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tr> <td><!--[if mso]> <center> <table><tr><td width="600"><![endif]--> <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width:600px;" align="center"> <tr> <td role="modules-container" style="padding: 0px 0px 0px 0px; color: #000000; text-align: left;" bgcolor="#bfbfbf" width="100%" align="left"> <table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;"> <tr> <td role="module-content"> <p></p></td></tr></table> <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tr> <td style="padding:015px 45px 15px 45px;line-height:22px;text-align:inherit;" height="100%" valign="top" bgcolor=""> <p style="text-align: center;"><strong><span style="color:#3E3E3E;"><span style="font-size:20px;">Resource wastage notification</span></span></strong></p></td></tr></table> <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tr> <td style="font-size:6px;line-height:10px;padding:0px 0px 0px 0px;" valign="top" align="center"> <img class="max-width" border="0" style="display:block;color:#000000;text-decoration:none;font-family:Helvetica, arial, sans-serif;font-size:16px;max-width:100% !important;width:100%;height:auto !important;" src="https://cms.groupeditors.com/img/c819d5c7-4563-4c37-9caf-e58762410269.jpg" alt="" width="600"> </td></tr></table> <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tr> <td style="padding:030px 45px 0px 45px;line-height:22px;text-align:inherit;" height="100%" valign="top" bgcolor=""> <div style="text-align: center;"><strong>Resource Type:&nbsp;</strong><p>'
            + resource
            + '</p></div></td></tr></table> <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tr> <td style="padding:030px 45px 0px 45px;line-height:22px;text-align:inherit;" height="100%" valign="top" bgcolor=""> <div style="text-align: center;"><strong>Incident Location:&nbsp;</strong><p>'
            + location
            + '</p></div></td></tr></table> <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"> <tr> <td style="padding:030px 45px 0px 45px;line-height:22px;text-align:inherit;" height="100%" valign="top" bgcolor=""> <div style="text-align: center;"><span style="font-weight: 600; background: rgb(191, 191, 191); font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-family: helvetica, arial, sans-serif; font-size: 16px; color: rgb(0, 0, 0); text-align: center;">Incident Description:&nbsp;</span><p>'
            + report
            + '</p></div></td></tr></table> <table border="0" cellPadding="0" cellSpacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed" width="100%"><tbody><tr><td align="center" class="outer-td" style="padding:30px 0px 030px 0px"><table border="0" cellPadding="0" cellSpacing="0" class="button-css__deep-table___2OZyb wrapper-mobile" style="text-align:center"><tbody><tr><td align="center" bgcolor="#3b61ff" class="inner-td" style="border-radius:6px;font-size:16px;text-align:center;background-color:inherit"><a style="background-color:#3b61ff;border:1px solid #333333;border-color:#3B61FF;border-radius:3px;border-width:1px;color:#ffffff;display:inline-block;font-family:helvetica,arial,sans-serif;font-size:16px;font-weight:bold;letter-spacing:0px;line-height:16px;padding:12px 040px 12px 40px;text-align:center;text-decoration:none" href="https://spatialwits.azurewebsites.net/" target="_blank">Visit site for more logs</a></td></tr></tbody></table></td></tr></tbody></table><div data-role="module-unsubscribe" class="module unsubscribe-css__unsubscribe___2CDlR" role="module" data-type="unsubscribe" style="background-color:#9ee7ff;color:#7a7a7a;font-size:11px;line-height:20px;padding:30px 0px 30px 0px;text-align:center"><div class="Unsubscribe--addressLine"><p class="Unsubscribe--senderName" style="font-family:;font-size:11px;line-height:20px">'
            + 'Wits energy visualisation team'
            + '</p><p style="font-family:;font-size:11px;line-height:20px"><span class="Unsubscribe--senderAddress">'
            + 'University of the Witwatersrand'
            + '</span></p></div><p style="font-family:;font-size:11px;line-height:20px"><a class="Unsubscribe--unsubscribeLink" href="<%asm_global_unsubscribe_raw_url%>" style="color:#2277ee">Unsubscribe</a> - <a class="Unsubscribe--unsubscribePreferences" href="[Unsubscribe_Preferences]" style="color:#2277ee">Unsubscribe Preferences</a></p></div></td></tr></table><!--[if mso]> </td></tr></table> </center><![endif]--> </td></tr></table> </td></tr></table> </td></tr></table> </div></center> </body></html>',
    };
    sgMail.send(msg);

    res.sendStatus(200);
});

module.exports = mainRouter;