import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";
import { TaglineModel } from "../model/tagline.js";

 // controller to add the tagline in the database 
export const addTagline = asyncHandler(async (req, res) => {
    
    const {heading , paragraph} = req?.body

    if(!heading || !paragraph){
        res.status(500).json({status : false , message : "Incomplete form parameters"})
    } 
    const tagline = new TaglineModel({
        heading,
        paragraph
    });
   await tagline.save();
    res.status(200).json({status : true , message : "Tagline added successfully",
        data : {
            heading ,
            paragraph

        }
    })


});


//contoller to get all the taglines

export const getTagline = asyncHandler(async (req, res) => {
    try {
        
        const data = await TaglineModel.find({});

       
        res.status(200).json({
            status: true,
            message: "Taglines retrieved successfully",
            data: data,  
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

//contoller to delete all the taglines
export const deleteTagline = asyncHandler(async (req, res) => {
    const {_id} = req?.params
    console.log(_id)
    try {
        const findTagline = await TaglineModel.findByIdAndDelete(_id);
        res.status(200).json({
            status: true,
            message: "Tagline deleted successfully",
            data: findTagline,  
        });
    } catch (error) {
        res.status(500).json({   
            status: false,
            message: error.message,
        });

    }
})


//contoller to update  the tagline

export const updateTagline = asyncHandler(async (req, res) => {
    const {_id} = req?.params
    const {heading , paragraph} = req?.body
    try {
        const updateTageline = await TaglineModel.findOneAndUpdate(
            {_id},
            {
                heading,
                paragraph
            },
            {
                new : true
            }
        )
        res.status(200).json({
            status : true,
            message : "Tagline updated successfully",
            data : updateTageline
        })
    } catch(error){ 
        console.log("error in Updating the tagline" , error)
        res.status(500).json({
            status : false,
            message : error.message
        })
     }
})

//Activate the tagline 
export const activateTagline = asyncHandler(async (req, res) => {
    const {_id} = req?.params
    try {
        const data = await TaglineModel.findOneAndUpdate({isActive : true} , {
            isActive : false
        },);


        const updateTageline = await TaglineModel.findOneAndUpdate(
            {_id},
            {
                isActive : true
            },
            {
                new : true
            }
        )
        res.status(200).json({
            status : true,
            message : "Tagline Activated successfully",
            data : updateTageline
        })

    } catch(error){
        console.log("error in Updating the tagline" , error)
        res.status(500).json({
            status : false,
            message : error.message
        })
    }
})