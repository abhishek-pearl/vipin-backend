import mongoose from "mongoose";

const topSectionFeaturesSchema = new mongoose.Schema({
  title:{
    type:String
  }
}); 

const faqSchema = new mongoose.Schema({
  que:{
    type:String
  },
  ans:{
    type:String
  }
});

const featuresSchema = new mongoose.Schema({
    icon:{
        type:String
    },
    description:{
        type:String
    },
    heading:{
        type:String
        
    }
});

const doAndDontSchema = new mongoose.Schema({
    do:{
        type:String
    },
    dont:{
        type:String
    }
})

const serviceSchema = new mongoose.Schema({
    serviceTitle:{
        type:String,
        minlength:[4,"Min Length For serviceTitle 4!!"],
        maxlength:[100,"Max Length For serviceTitle 100 !!"],
        required:true,
        unique:true
    },
    description:{
        type:String,
        minlength:[5,"Min Length For description 4!!"],
        maxlength:[150,"Max Length For description 150 !!"],
        required:true
    },
    serviceIcon:{
        type:String,
    },
    topSection:{
        miniTitle:{
            type:String,
            minlength:[5,"Min miniTitle Length must be Equal to 5 or greater"],
            maxlength:[50,"Max Length For miniTitle 50 !!"],
            required:true
        },
        heading:{
            type:String,
            minlength:[5,"Min Length For heading 5 !!"],
            maxlength:[150,"Max Length For heading 150 !!"],
            required:true
        },
        features:{
            type:[topSectionFeaturesSchema],
        },
        banner:{
            type:String
        }
    },
    midSection:{
        topContent:{
            heading:{
                type:String,
                minlength:[5,"Min Length For heading 5!!"],
                maxlength:[1000,"Max Length For heading 500 !!"],
                required:true
            },
            description:{
                type:String,
                minlength:[5,"Min Length For description 5!!"],
                maxlength:[1000,"Max Length For description 500!!"],
                required:true
            }
        },
        faq:{
            type:[faqSchema]
        },
        stepsToAvailLoan:{
            heading:{
                type:String,
                minlength:[5,"Min Length For heading 5 !!"],
                maxlength:[150,"Min Length For heading 150 !!"],
                required:true
            },
            steps:[topSectionFeaturesSchema],
            banner:{
                type:String
            }
        }
    },

    bottomSection:{
        features:[featuresSchema],
        doAndDont:[doAndDontSchema],
        faq:[faqSchema]
    }

},
{
    timestamps:true
});


export const serviceModel = mongoose.model("Services",serviceSchema);
