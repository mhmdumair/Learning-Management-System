import mongoose,{Document,Model,Schema} from 'mongoose'

interface IComment extends Document{
    user:object
    comment : string
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
    title:string
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