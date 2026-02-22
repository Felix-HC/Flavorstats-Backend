import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const sum = (arr) => { return arr.reduce((total, current) => total + current, 0); }

const countWords = (arr) => {
    const newString = arr.reduce((total, current) => {
        return total + " " + current;
    }, "");

    return newString.split(/\s+/).length;
}

const config = {
    headers: { Authorization: `Bearer ${process.env.FLAVORTOWN_API_KEY}` }
};

export default async function getStats(userID, res) {
    const userObject = {};

    try {
        // Get general information about user
        const userEndpoint = await axios.get(`${process.env.FLAVORTOWN_API_URL}/users/${userID}`, config);

        userObject.displayName = userEndpoint.data.display_name;
        userObject.avatar = userEndpoint.data.avatar;
        userObject.voteCount = userEndpoint.data.vote_count;
        userObject.likeCount = userEndpoint.data.like_count;
        userObject.totalTimeSeconds = userEndpoint.data.devlog_seconds_total;
        userObject.cookies = userEndpoint.data.cookies;

        // Get project information
        const projectIDs = userEndpoint.data.project_ids;
        userObject.projects = await getProjects(projectIDs);

        // Return Object
        res.status(200).send(userObject);
    } catch (error) {
        console.error(error);
        res.status(500).send({error: "Internal Server Error"});
    }
}

async function getProjects(projectIDs) {
    const projectsArray = [];

    for (const projectID of projectIDs) {
        const projectEndpoint = await axios.get(`${process.env.FLAVORTOWN_API_URL}/projects/${projectID}`, config);

        const projectObject = {};
        projectObject.title = projectEndpoint.data.title;
        projectObject.description = projectEndpoint.data.description;
        projectObject.creationDate = projectEndpoint.data.created_at;
        projectObject.shipped = projectEndpoint.data.ship_status === "draft" ? false : true;
        projectObject.usedAI = projectEndpoint.data.ai_declaration !== null && projectEndpoint.data.ai_declaration !== "" ? true : false;

        projectObject.devlogs = await getDevlogStats(projectID);

        projectsArray.push(projectObject);
    }

    return projectsArray;
}

async function getDevlogStats(projectID) {
    const devlogEndpoint = await axios.get(`${process.env.FLAVORTOWN_API_URL}/projects/${projectID}/devlogs`, config);

    const devlogsObject = {};
    const contents = [];
    const dates = [];
    const durationsSeconds = [];
    let totalLikes = 0;
    let totalComments = 0;

    const devlogsArray = devlogEndpoint.data.devlogs;

    devlogsArray.forEach((devlog) => {
        totalLikes += devlog.likes_count || 0;
        totalComments += devlog.comments_count || 0;
        contents.push(devlog.body);
        dates.push(devlog.created_at);
        durationsSeconds.push(devlog.duration_seconds);
    });

    // Add em!
    devlogsObject.total = devlogsArray.length;
    devlogsObject.totalTimeLogged = sum(durationsSeconds);

    devlogsObject.totalLikes = totalLikes;
    devlogsObject.totalComments = totalComments;

    devlogsObject.totalChars = sum(contents).length;
    devlogsObject.totalWords = countWords(contents);

    devlogsObject.dates = dates;

    return devlogsObject;
}