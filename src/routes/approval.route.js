const express = require('express')
const router = new express.Router()
const { authAdmin } = require('../middleware/auth.middleware')
const Approval = require('../models/ManyToMany/approval.model')
const Product = require('../models/products/product.model')
const Admin = require('../models/admin/Admin.model')
const Image = require('../models/products/images.model')
router.get('/getApproval', authAdmin ,async (req, res) => {
    try {
        const productWithApprove = await Product.findAll({
            include: [{
                model: Admin,
                as: 'adminApproval',
                attributes: { exclude: ['password'] },
            }, {
                model: Image,
                attributes: { exclude: ['data'] },

            }],
        })
        res.status(200).send(productWithApprove)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

router.get('/approveStatus', authAdmin, async(req,res)=>{
    try {
        const status = await Approval.findAll({
            attributes: {exclude: ['approvalID','adminID','approveDate']}
        })
        if(!status) return res.send({message:'No status'})
        res.status(200).send(status)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

router.put('/approveProduct/:prodId', authAdmin, async (req, res) => {
    try {
        const prodID = parseInt(req.params.prodId) 
         await Approval.update({ adminID: req.admin.adminID, status: req.body.status, approveDate: req.body.approveDate }, {
            where: {
                prodID
            }
        })
        
        if(req.body.status == 1){
            await Product.update({status:1},{
                where:{
                    prodID
                }
            })
        }else if(req.body.status == 2){
            await Product.update({status:0},{
                where:{
                    prodID
                }
            })
        }else{
            await Product.update({status:0},{
                where:{
                    prodID
                }
            })
        }
        const productWithApprove = await Product.findOne({
            where:{
                prodID
            },
            include: [{
                model: Admin,
                as: 'adminApproval',
                attributes: { exclude: ['password'] },
            }, {
                model: Image,
                attributes: { exclude: ['data'] },

            }],
        })
        return res.status(201).send(productWithApprove)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})


module.exports = router