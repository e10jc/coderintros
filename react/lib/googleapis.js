// @flow

import google from 'googleapis'

const authorize = ({scopes}: Object) => {
  return new Promise((resolve, reject) => {
    let creds = {
      client_email: process.env.GOOGLE_API_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_API_PRIVATE_KEY
    }

    if (!creds.client_email || !creds.private_key) {
      creds = require('../google-api-creds.json')
    }

    const auth = new google.auth.JWT(
      creds.client_email, null, creds.private_key, scopes
    )

    auth.authorize(err => {
      if (err) {
        reject(err)
      } else {
        resolve(auth)
      }
    })
  })
}

const getValueRange = ({auth, spreadsheetId, range}: Object) => {
  return new Promise((resolve, reject) => {
    google.sheets('v4').spreadsheets.values.get({
      auth, spreadsheetId, range
    }, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

export const getQuestions = async () => {
  const auth = await authorize({
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  })

  const valueRange = await getValueRange({
    auth,
    range: 'A1:Z100',
    spreadsheetId: '1aXs0S9ZTnzuVf66FqytsluB0IESnQ5sCbvQUETYbaU0'
  })

  const finalData = []

  valueRange.values.forEach((row, i) => {
    if (i === 0) {
      row.forEach(section => {
        finalData.push({
          section,
          questions: []
        })
      })
    } else {
      row.forEach((val, j) => {
        finalData[j].questions.push(val)
      })
    }
  })

  return finalData
}
