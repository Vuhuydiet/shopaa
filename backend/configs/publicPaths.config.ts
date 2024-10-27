import { pathToRegexp } from "path-to-regexp";

const publicPaths = {
  GET: [
    '/otp',

    '/auth/google',
    '/auth/google/callback',
    '/auth/facebook',
    '/auth/facebook/callback',

    '/user/:userId',
  ],

  POST: [
    '/sign-up',
    '/sign-in',
  ],

  PUT: [

  ],

  PATCH: [

  ],

  DELETE: [

  ],

  at: (method: any) => {
    switch (method) {
      case 'GET':
        return publicPaths['GET'];
      case 'POST':
        return publicPaths['POST'];
      case 'PUT':
        return publicPaths['PUT'];
      case 'PATCH':
        return publicPaths['PATCH'];
      case 'DELETE':
        return publicPaths['DELETE'];
    }
    return [];
  },

  match: (method: any, testPath: string): boolean => {
    const paths = publicPaths.at(method);
    return paths.some(pattern => pathToRegexp(pattern).regexp.test(testPath));
  }
}

export default publicPaths;