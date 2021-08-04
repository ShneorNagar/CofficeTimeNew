import "reflect-metadata";
import {createConnection} from "typeorm";

createConnection().then(async connection => {

    console.log("typeorm connection created.");

}).catch(error => console.log(error));
