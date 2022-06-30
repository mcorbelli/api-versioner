import { NextFunction, Request, Response, Router } from 'express';
import semver from 'semver';

const { valid, satisfies } = semver;

interface IOptions {
    addNotFoundRoute: boolean;
}

interface IRoute {
    versionsMap: Map<string, Router>;
    options: IOptions;
}

class ApiVersioner {

    static route(props: IRoute) {

        return (req: Request, res: Response, next: NextFunction) => {

            try {

                for (let [versionKey, versionRouter] of props.versionsMap) {

                    if (props.options.addNotFoundRoute) {
                        this._addNotFoundRoute(versionRouter);
                    }

                    if (this._checkVersionMatch(this._extractVersion(req), versionKey)) {
                        return versionRouter(req, res, next);
                    }

                }

                res.status(404).send({
                    "error": `${this._extractVersion(req)} doesn't match any versions`,
                });

            } catch (error) {

                return res.status(500).send({
                    "error": `error during execution: ${error}`,
                });

            }

        }

    }

    private static _extractVersion(req: Request): string {
        return req.headers['accept-version']?.toString() ?? "1.0.0";
    }

    private static _addNotFoundRoute(router: Router): void {
        router.all('*', (req, res) => {
            res.status(404).send({
                "error": `route '${req.url}' does not exist`,
            });
        });
    }

    private static _checkVersionMatch(requestedVersion: string, routeVersion: string): boolean {
        return (valid(requestedVersion) != null) && satisfies(requestedVersion, routeVersion);
    }

}

module.exports = ApiVersioner;