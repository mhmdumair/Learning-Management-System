import mongoose,{Document,Model,Schema} from 'mongoose'

interface IComment extends Document{
    user:object
    comment : string
    commentReply? : IComment[]
}

interface IReview extends Document{
    user:object
    rating : number
    comment : string
    commentReply : IComment[]
}

interface ILink extends Document{
    title : string
    url : string
}

interface ICourseData extends Document{
    title:string
    description : string
    videoUrl : string
    videoThumbnail : object
    videoSection : string
    videoLength : string
    videoPlayer : string
    links : ILink[]
    suggestion : string
    questions : IComment[]
}

interface ICourse extends Document{
    name:string
    description : string
    price : number
    estimatedPrice : number
    thumbnail : object
    tags : string
    level : string
    demoUrl : string
    benefits : {title:string}[]
    prerequisites : {title:string}[]
    rating? : number
    review : IReview[]
    courseData : ICourseData[]
    purchased? : number
}


const reviewSchema = new Schema<IReview>({
    user : Object,
    rating: {
        type: Number,
        default: 0
    },
    comment : String
})

const linkSchema = new Schema<ILink>({
    title : String,
    url : String
})

const commentSchema = new Schema<IComment>({
    user : Object,
    comment : String,
    commentReply : [Object]
})

const courseDataSchema = new Schema<ICourseData>({
    title : String,
    description : String,
    videoUrl : String,  
    videoThumbnail : Object,
    videoSection : String,
    videoLength : String,
    videoPlayer : String,
    links : [linkSchema],
    suggestion : String,
    questions : [commentSchema]
})

const courseSchema = new Schema<ICourse>({
    name : {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    estimatedPrice:{
        type: Number
    },
    thumbnail : {
        public_id : {
            type: String,
            required: true
        },
        url : {
            type: String,
            required: true
        }
    },
    tags : {
        type: String,
        required: true
    },
    level : {
        type: String,
        required: true
    },
    demoUrl : {
        type: String,
        required: true
    },
    benefits : [{
        title : String
    }],
    prerequisites : [{
        title : String
    }],
    review : [reviewSchema],
    courseData : [courseDataSchema],
    rating : {
        type: Number,
        default: 0
    },
    purchased : {
        type: Number,
        default: 0
    }
})

const courseModel :Model<ICourse> =mongoose.model('Course',courseSchema)

export default courseModel