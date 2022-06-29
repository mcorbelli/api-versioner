
# **api-versioner**

api express version manager

-----------

## Usage

    import express from "express";
    import ApiVersioner from "api-versioner";

    import one from './one';
    import two from './two';

    const app = express();

    const routesMap = new Map();

    routesMap.set('1.0.0', one);
    routesMap.set('1.0.2', two);

    app.use('/apis', ApiVersioner.route(routesMap));

    export default app;

-------

## Contact

[GitHub](https://github.com/mcorbelli/api-versioner). 