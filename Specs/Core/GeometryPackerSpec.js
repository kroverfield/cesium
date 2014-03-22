/*global defineSuite*/
defineSuite([
         'Core/GeometryPacker',
         'Core/BoxGeometry',
         'Core/VertexFormat',
         'Core/Cartesian3',
         'Core/Color',
         'Core/Matrix4',
         'Core/ShowGeometryInstanceAttribute',
         'Core/ColorGeometryInstanceAttribute'
     ], function(
         GeometryPacker,
         BoxGeometry,
         VertexFormat,
         Cartesian3,
         Color,
         Matrix4,
         ShowGeometryInstanceAttribute,
         ColorGeometryInstanceAttribute) {
    "use strict";
    /*global jasmine,describe,xdescribe,it,xit,expect,beforeEach,afterEach,beforeAll,afterAll,spyOn,runs,waits,waitsFor*/

    it('can pack and unpack for createGeometry', function() {
        var original = [BoxGeometry.createGeometry(new BoxGeometry({
            minimumCorner : new Cartesian3(0, 0, 0),
            maximumCorner : new Cartesian3(1, 1, 1),
            vertexFormat : VertexFormat.ALL
        }))];

        var stringTable = [];
        var packed = GeometryPacker.packForCreateGeoemtry(original, stringTable);
        var unpacked = GeometryPacker.unpackFromCreateGeometry(packed, stringTable);
        expect(original).toEqual(unpacked);
    });

    it('can pack and unpack for combineGeometry', function() {
        var original = [{
            attributes : {
                show : new ShowGeometryInstanceAttribute(true),
                color : ColorGeometryInstanceAttribute.fromColor(Color.fromRandom({
                    alpha : 0.5
                }))
            },
            modelMatrix : Matrix4.IDENTITY
        }];

        var stringTable = [];
        var packed = GeometryPacker.packInstancesForCombine(original, stringTable);
        var unpacked = GeometryPacker.unpackInstancesForCombine(packed, stringTable);
        expect(original).toEqual(unpacked);
    });
});