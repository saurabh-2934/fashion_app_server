const transporter = require('../mailManager/mailer')
const bcrypt = require('bcrypt')
const validator = require('validator')
const models = require('../models')

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

const sendMail = async (req, res) => {
    try {

        const { email } = req.body

        if (!email) {
            return res.status(400).json({ error_msg: 'Email required' })
        }

        if(!validator.isEmail(email)) {
            return res.status(400).json({error_msg: 'Enter valid email'})
        }

        const isEmailExists = await models.User.findOne({
            where: {
                email
            }
        })

        if(!isEmailExists) {
            return res.status(400).json({error_msg: 'user does not exists'})
        }

        const otp = generateOTP()

        // Store OTP with expiry (5 mins)
        const expiresAt = Date.now() + 5 * 60 * 1000
        
        await models.User.update({otp, expiry_otp: expiresAt}, {
            where: {
                email
            }
        })

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Recovery',
            text: `Your OTP is ${otp}. It is valid for 5 minutes.`
        })

        return res.status(200).json({ message: 'OTP sent successfully' })

            
        } catch (e) {
           res.status(500)
           res.send({error_msg: e.message})
        }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body

        const data = await models.User.findOne({
            where: {
                email
            }
        })

        if (!data) {
            return res.status(400).json({ error_msg: 'OTP not found' })
        }

        if (Date.now() > data.expiry_otp) {
            return res.status(400).json({ error_msg: 'OTP expired' })
        }

        if (data.otp !== otp) {
            return res.status(400).json({ error_msg: 'Invalid OTP' })
        }

        // Success
        await data.update({
            otp: null,
            expiry_otp: null
        })
        res.send({ message: 'OTP verified successfully' })
    } catch (e) {
       res.status(500)
       res.send({error_msg: e.message})
    }
}

const setnewPassword = async (req, res) => {
    try{
        const {email, newPassword} = req.body

        if(!email || !newPassword) {
            return res.status(400).json({error_msg: 'All feilds are required'})
        }
        
        if(!validator.isEmail(email)) {
            return res.status(400).json({error_msg: 'Invalid Email'})
        }

        const isEmailExists = await models.User.findOne({
            where: {
                email
            }
        })

        const hashedPass =await bcrypt.hash(newPassword, 10)

        isEmailExists.update({
            password: hashedPass
        })
        
       return res.status(200).json({message: 'Password updated'})


    }catch (e) {
      res.status(500)
      res.send({error_msg: e.message})
    }
}

module.exports = {
    sendMail: sendMail,
    verifyOtp: verifyOtp,
    setnewPassword: setnewPassword
}