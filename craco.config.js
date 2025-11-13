module.exports = {
    webpack: {
        configure: {
            module: {
                rules: [
                    {
                        test: /\.m?js$/,
                        resolve: {
                            fullySpecified: false, // Disable the fully specified rule for JS files
                        },
                    },
                ],
            },
        },
    },
};
