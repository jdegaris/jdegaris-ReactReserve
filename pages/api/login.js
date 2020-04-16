import connectDb from '../../utils/connectDb'
import User from '../../models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'

connectDb()

export default async (req, res) => {
    const { email, password } = req.body
    try {
        // Validate name / email / password
        if (!isLength(password, { min: 6 })) {
            return res.status(422).send("Please provide a valid password")
        } else if (!isEmail(email)) {
            return res.status(422).send("Please provide a valid email address")
        }
        // Check to see if a user exists with the provided email
        const user = await User.findOne({ email }).select('+password')
        // if user is found - return error
        if (!user) {
            return res.status(401).send("Invalid credentials")
        }
        // Check to see if provided password matches stored password
        const passwordsMatch = await bcrypt.compare(password, user.password)
        // If so - generate token
        if (passwordsMatch) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })// Send token to client
            res.status(200).json(token)
        } else {
            res.status(401).send("Invalid credentials")
        }
    } catch (err) {
        console.error(err)
        res.status(500).send("There was an error logging in the user")
    }
}