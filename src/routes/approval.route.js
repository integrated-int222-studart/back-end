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
                as: 'adminAppoval',
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
            return res.status(201).send({message:'Admin update approved: status 1'})
        }else if(req.body.status == 2){
            await Product.update({status:0},{
                where:{
                    prodID
                }
            })
            return res.status(201).send({message:'Admin update disapproved: status 2'})
            
        }else{
            await Product.update({status:0},{
                where:{
                    prodID
                }
            })
            return res.status(201).send({message:'Admin not update yet: status 0'})
        }
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

module.exports = router