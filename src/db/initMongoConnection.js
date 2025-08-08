import mongoose from "mongoose";
import { ENV_VARS } from "../utils/envVars.js";
import { getEnvVar } from "../utils/getEnvVar.js";

const { connect, connection } = mongoose;
export const initMongoConnection = async () => {
    const user = getEnvVar(ENV_VARS.MONGODB_USER);
    const password = getEnvVar(ENV_VARS.MONGODB_PASSWORD);
    const url = getEnvVar(ENV_VARS.MONGODB_URL);
    const db = getEnvVar(ENV_VARS.MONGODB_DB);
    const uri = `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=nodejs-hw-mongodb`
    try {
        await connect(uri);
        await connection.db.admin().command({ ping: 1 });
        console.log('Mongo connection successfully established!');
    } catch (err) {
        console.error('Error while setting up mongo connection', err);
        process.exit(1);
    }
};
export default initMongoConnection;