// Need some libraries from npmjs.com
require('dotenv').config();
const formidable = require('formidable');
const https = require('https');
const { v4: uuidv4 } = require('uuid');

// Need the external paytm library to authenticate the payments
const PaytmChecksum = require('./PaytmChecksum.js');


exports.payment = (req, res) => {
    const { 
        amount,
        email,
        mobileNo
    } = req.body;

    //will use the Paytm API Keys(.env) and the PaytmChecksum.js to prepare the payment request object

    let params = {};

    params['MID'] = process.env.PAYTM_MID;
    params['WEBSITE'] = process.env.PAYTM_WEBSITE;
    params['CHANNEL_ID'] = process.env.PAYTM_CHANNEL_ID;
    params['INDUSTRY_TYPE_ID'] = process.env.PAYTM_INDUSTRY_TYPE;
    params['ORDER_ID'] = uuidv4();
    params['CUST_ID'] = email;
    params['TXN_AMOUNT'] = amount.toString();
    params['EMAIL'] = email;
    params['MOBILE_NO'] = mobileNo.toString();
    params['CALLBACK_URL'] = 'http://localhost:5402/api/paymentCallback';

    // use PaytmChecksum.js to generate a signature

    let paytmCheckSum = PaytmChecksum.generateSignature(params, process.env.PAYTM_MERCHANT_KEY);

    paytmCheckSum.then(response => {
        let paytmCheckSumResponse = {
            ...params,
            "CHECKSUMHASH": response
        };
        res.json(paytmCheckSumResponse);
    }).catch(error => {
        res.status(500).json({
            message: "Error in Payment",
            error: error
        });
    });


}

exports.paymentCallback = (req, res) => {
    // called by Paytm Server, Paytm Server will send the transaction information
    // Need to read this transactions information

    const form = new formidable.IncomingForm();

    form.parse(req, (error, fields, file) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error });
        }

        const checkSumHash = fields.CHECKSUMHASH;
        delete fields.CHECKSUMHASH;

        // verify the signature

        const isVerified = PaytmChecksum.verifySignature(
            fields,
            process.env.PAYTM_MERCHANT_KEY,
            checkSumHash
        );

        if (isVerified) {
            // response is valid

            // get the transaction status from the paytm Server
            var params = {};
            params["MID"] = fields.MID;
            params["ORDER_ID"] = fields.ORDERID;

            PaytmChecksum.generateSignature(
                params,
                process.env.PAYTM_MERCHANT_KEY
            ).then(checksum => {
                // go to the Paytm Server and get the payment status
                params["CHECKSUMHASH"] = checksum;
                const data = JSON.stringify(params);

                const options = {
                    hostname: "securegw-stage.paytm.in",
                    port: 443,
                    path: "/order/status",
                    method: "POST",
                    header: {
                        'Content-Type': 'application/json',
                        'Content-Length': data.legth
                    },
                    data: data
                };
                var response = "";
                var request = https.request(options, (responseFromPaytmServer) => {
                    responseFromPaytmServer.on('data', (chunk) => {
                        response += chunk;
                    });
                    responseFromPaytmServer.on('end', () => {
                        if (JSON.parse(response).STATUS === 'TXN_SUCCESS') {
                            // Success
                            //res.send('Payment was SUCCESS');

                            // (1) Save the order and payment details in MongoDB

                            res.sendFile(__dirname + '/success.html');
                        } else {
                            // FAILURE
                            //res.send('Payment was FAILURE');

                            // (1) Save the order and payment details in MongoDB
                            res.sendFile(__dirname + '/failure.html');
                        }
                    });
                });
                request.write(data);
                request.end();
            }).catch(error => {
                res.status(500).json({
                    message: "Error in Transaction",
                    error: error
                });
            });
        } else {
            // response is NOT Valid
            console.log('Checksum mismatch');
            res.status(500).json({ error: "It's a hacker !" });
        }
    })
}