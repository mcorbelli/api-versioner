import { NextFunction, Request, Response, Router } from 'express';
import { isNil } from 'lodash';
import semver from 'semver';

const { valid, satisfies } = semver;

class ApiVersioner {

    static route(versionsMap: Map<string, Router>) {

        return (req: Request, res: Response, next: NextFunction) => {

            if (isNil(req.query.version)) {

                return res.status(400).send({
                    "error": 'no version of the api is specified',
                });

            }

            for (let [versionKey, versionRouter] of versionsMap) {

                if (this.checkVersionMatch(this.extractVersion(req), versionKey)) {
                    return versionRouter(req, res, next);
                }

            }

            return res.status(400).send({
                "error": `${this.extractVersion(req)} doesn't match any versions`,
            });

        }

    }

    static extractVersion(request: Request): string {
        return `${request.query.version}`;
    }

    static checkVersionMatch(requestedVersion: string, routeVersion: string): boolean {
        return (valid(requestedVersion) != null) && satisfies(requestedVersion, routeVersion);
    }

}

export default ApiVersioner;