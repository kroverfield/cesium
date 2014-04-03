/*global define*/
define([
        './defined',
        './DeveloperError',
        './Cartesian3',
        './ComponentDatatype',
        './PrimitiveType',
        './defaultValue',
        './BoundingSphere',
        './Geometry',
        './GeometryAttribute',
        './GeometryAttributes'
    ], function(
        defined,
        DeveloperError,
        Cartesian3,
        ComponentDatatype,
        PrimitiveType,
        defaultValue,
        BoundingSphere,
        Geometry,
        GeometryAttribute,
        GeometryAttributes) {
    "use strict";

    var diffScratch = new Cartesian3();

    /**
     * A description of the outline of a cube centered at the origin.
     *
     * @alias FanOutlineGeometry
     * @constructor
     *
     * @param {Cartesian3} options.minimumCorner The minimum x, y, and z coordinates of the fan.
     * @param {Cartesian3} options.maximumCorner The maximum x, y, and z coordinates of the fan.
     *
     * @see FanOutlineGeometry#fromDimensions
     * @see FanOutlineGeometry#createGeometry
     *
     * @example
     * var fan = new Cesium.FanOutlineGeometry({
     *   maximumCorner : new Cesium.Cartesian3(250000.0, 250000.0, 250000.0),
     *   minimumCorner : new Cesium.Cartesian3(-250000.0, -250000.0, -250000.0)
     * });
     * var geometry = Cesium.FanOutlineGeometry.createGeometry(fan);
     */
    var FanOutlineGeometry = function(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        var min = options.minimumCorner;
        var max = options.maximumCorner;

        //>>includeStart('debug', pragmas.debug);
        if (!defined(min)) {
            throw new DeveloperError('options.minimumCorner is required.');
        }
        if (!defined(max)) {
            throw new DeveloperError('options.maximumCorner is required');
        }
        //>>includeEnd('debug');

        this._min = Cartesian3.clone(min);
        this._max = Cartesian3.clone(max);
        this._workerName = 'createFanOutlineGeometry';
    };

    /**
     * Creates an outline of a cube centered at the origin given its dimensions.
     * @memberof FanOutlineGeometry
     *
     * @param {Cartesian3} options.dimensions The width, depth, and height of the fan stored in the x, y, and z coordinates of the <code>Cartesian3</code>, respectively.
     *
     * @exception {DeveloperError} All dimensions components must be greater than or equal to zero.
     *
     * @see FanOutlineGeometry#createGeometry
     *
     * @example
     * var fan = Cesium.FanOutlineGeometry.fromDimensions({
     *   dimensions : new Cesium.Cartesian3(500000.0, 500000.0, 500000.0)
     * });
     * var geometry = Cesium.FanOutlineGeometry.createGeometry(fan);
     */
    FanOutlineGeometry.fromDimensions = function(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);
        var dimensions = options.dimensions;

        //>>includeStart('debug', pragmas.debug);
        if (!defined(dimensions)) {
            throw new DeveloperError('options.dimensions is required.');
        }
        if (dimensions.x < 0 || dimensions.y < 0 || dimensions.z < 0) {
            throw new DeveloperError('All dimensions components must be greater than or equal to zero.');
        }
        //>>includeEnd('debug');

        var corner = Cartesian3.multiplyByScalar(dimensions, 0.5);
        var min = Cartesian3.negate(corner);
        var max = corner;

        var newOptions = {
            minimumCorner : min,
            maximumCorner : max
        };
        return new FanOutlineGeometry(newOptions);
    };

    /**
     * Computes the geometric representation of an outline of a fan, including its vertices, indices, and a bounding sphere.
     * @memberof FanOutlineGeometry
     *
     * @param {FanOutlineGeometry} fanGeometry A description of the fan outline.
     * @returns {Geometry} The computed vertices and indices.
     */
    FanOutlineGeometry.createGeometry = function(fanGeometry) {
        var min = fanGeometry._min;
        var max = fanGeometry._max;

        var attributes = new GeometryAttributes();
        var indices = new Uint16Array(12 * 2);
        var positions = new Float64Array(8 * 3);

        positions[0] = min.x;
        positions[1] = min.y;
        positions[2] = min.z;
        positions[3] = max.x;
        positions[4] = min.y;
        positions[5] = min.z;
        positions[6] = max.x;
        positions[7] = max.y;
        positions[8] = min.z;
        positions[9] = min.x;
        positions[10] = max.y;
        positions[11] = min.z;

        positions[12] = min.x;
        positions[13] = min.y;
        positions[14] = max.z;
        positions[15] = max.x;
        positions[16] = min.y;
        positions[17] = max.z;
        positions[18] = max.x;
        positions[19] = max.y;
        positions[20] = max.z;
        positions[21] = min.x;
        positions[22] = max.y;
        positions[23] = max.z;

        attributes.position = new GeometryAttribute({
            componentDatatype : ComponentDatatype.DOUBLE,
            componentsPerAttribute : 3,
            values : positions
        });

        // top
        indices[0] = 4;
        indices[1] = 5;
        indices[2] = 5;
        indices[3] = 6;
        indices[4] = 6;
        indices[5] = 7;
        indices[6] = 7;
        indices[7] = 4;

        // bottom
        indices[8] = 0;
        indices[9] = 1;
        indices[10] = 1;
        indices[11] = 2;
        indices[12] = 2;
        indices[13] = 3;
        indices[14] = 3;
        indices[15] = 0;

        // left
        indices[16] = 0;
        indices[17] = 4;
        indices[18] = 1;
        indices[19] = 5;

        //right
        indices[20] = 2;
        indices[21] = 6;
        indices[22] = 3;
        indices[23] = 7;

        var diff = Cartesian3.subtract(max, min, diffScratch);
        var radius = Cartesian3.magnitude(diff) * 0.5;

        return new Geometry({
            attributes : attributes,
            indices : indices,
            primitiveType : PrimitiveType.LINES,
            boundingSphere : new BoundingSphere(Cartesian3.ZERO, radius)
        });
    };

    return FanOutlineGeometry;
});