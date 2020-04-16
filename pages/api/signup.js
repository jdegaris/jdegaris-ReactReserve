import connectDb from '../../utils/connectDb'
import User from '../../models/User'
import Cart from '../../models/Cart'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import isEmail from 'validator/lib/isEmail'
import isLength from 'validator/lib/isLength'

connectDb()

export default async (req, res) => {
    const { name, email, password1, password2 } = req.body
    if (password1 === password2) {
        try {
            // Validate name / email / password
            if (!isLength(name, { min: 3, max: 10 })) {
                return res.status(422).send("Name must be 3-10 characters long")
            } else if (!isLength(password1, { min: 6 })) {
                return res.status(422).send("Password must be at least 6 characters long")
            } else if (!isEmail(email)) {
                return res.status(422).send("Please provide a valid email address")
            }
            // Check to see if the user already exists in the db
            const user = await User.findOne({ email })
            if (user) {
                return res.status(422).send(`A user with that email already exists`)
            }
            // If user does not exist, hash the password
            const hash = await bcrypt.hash(password1, 10)
            // Create User
            const newUser = await new User({
                name,
                email,
                password: hash
            }).save()
            console.log(newUser);
            // Create a cart for new user
            await new Cart({ user: newUser._id }).save()
            // Create token for the new user
            const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
            // Send back token
            res.status(201).json(token)
        } catch (err) {
            console.error(err)
            res.status(500).send("We could not sign you up. Please try again.")
        }
    } else {
        res.status(500).send("There was a problem with the password you entered. Please try again")
    }

}