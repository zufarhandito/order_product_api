// import models, {sequelize} from "../models/init-models.js"
import models, {sequelize} from "../models/init-models.js"
import bcrypt from 'bcrypt'
import fs from 'fs'

const passwordValidation = (password) => {
    const validationLowerCase = /[a-z]/
    const validationUpperCase = /[A-Z]/
    const validationDigit = /\d/
    const validationChar = /[@$!%*?&]/
    
    if(!validationLowerCase.test(password)) 
    throw new Error ("Password harus memiliki setidaknya satu huruf kecil")
    
    if(!validationUpperCase.test(password)) 
    throw new Error ("Password harus memiliki setidaknya satu huruf kapital")
    
    if(!validationDigit.test(password)) 
    throw new Error ("Password harus memiliki setidaknya satu angka")
    
    if(!validationChar.test(password)) 
    throw new Error ("Password harus memiliki setidaknya satu karakter spesial")

    if(password.length < 8)
    throw new Error ("Panjang password minimal harus 8")

    return password
} 

const createUsers = async(req,res) => {
    try {
        //validate password
        const password = passwordValidation(req.body.password)

        //bcrypt
        let salt = await bcrypt.genSalt(10)
        let passHash = await bcrypt.hash(password, salt)
        req.body.password = passHash;

        const data = `[${JSON.stringify(req.body)}]`;
    
        const query = `CALL insertUserCustomer2('${data}')`;
        const result = await sequelize.query(query);

        res.status(200).json({
            message: 'success',
            status: 200,
            data: result
        })

    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error.message,
        })
    }
}

const getUsers = async(req,res) => {
    try {
        // const result = await models.users.findAll({
        //     attributes: ['id','username'],
        //     include: [
        //         {
        //             model: models.customers,
        //             as: "customers",
        //             attributes: ['id','firstname','lastname'],
        //             required: true
        //         },
        //         {
        //             model: models.orders,
        //             as: "orders",
        //             attributes: ['totalproduct','totalprice'],
        //             // required: true,
        //             include: [
        //                 {
        //                     model: models.order_details,
        //                     as: "order_details",
        //                     attributes: ['quantity'],
        //                     // required: true,
        //                     include: [
        //                         {
        //                             model: models.products,
        //                             as: "product",
        //                             attributes: ['name','description','price','image'],
        //                             // required: true,
        //                             include: [
        //                                 {
        //                                     model: models.product_categories,
        //                                     as: 'category',
        //                                     attributes: ['name','description'],
        //                                     // required: true
                                            
        //                                 }
        //                             ]
        //                         }
        //                     ]
        //                 }
        //             ]
        //         }
        //     ]
        // })

        //using view
        const result = await models.selectusercustomer.findAll()
        res.status(200).json({
            message: 'success',
            status: 200,
            data: result
        })
    } catch (error) {
        res.status(404).json({
            message: error.message,
            status: 404
        })
    }
}

const getUserById = async(req,res) => {
    try {
        const result = await models.users.findOne({
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({
            message: 'success',
            status: 200,
            data: result
        })
    } catch (error) {
        res.status(404).json({
            message: error.message,
            status: 404
        })
    }
}

const updateUsers = async(req,res) => {     
    try {
        const idBody = await models.users.findByPk(req.params.id)
        if(!idBody) throw new Error('tidak ada id nya')

        let password = idBody.password
        let salt = await bcrypt.genSalt(10)
        let passHash = await bcrypt.hash(req.body.password, salt)

        if(req.body.password){
            password = passHash
        }

        res.status(200).json({
            message: 'berhasil di update',
            status: 200,
            data: idBody
        })
    } catch (error) {
        res.status(404).json({
            message: error.message,
            status: 404
        })
    }
}

const deleteUser = async(req,res) => {
    try {
        const idBody = await models.users.findByPk(req.params.id)
        if(!idBody) throw new Error('tidak ada id nya')

        await models.users.destroy({
            where:{
                id: req.params.id
            }
        })
        res.status(200).json({
            message: "data berhasil dihapus"
        })
    } catch (error) {
        res.status(404).json({
            message: error.message,
            status: 404
        })
    }
}

export default {
    createUsers,
    getUsers,
    getUserById,
    updateUsers,
    deleteUser
}