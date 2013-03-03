/*-------------------------------------------------------------------------
    This file is part of Voxelent's Nucleo

    Nucleo is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation version 3.

    Nucleo is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Nucleo.  If not, see <http://www.gnu.org/licenses/>.
---------------------------------------------------------------------------*/

/**
 * A cell is the minimum surface that can be selected on a mesh
 * @class Provides cell definitions
 * @constructor
 * @author Diego Cantor
 */
function vxlCell(vertices){ 
    this.UID = vxl.util.generateUID();
    this.color = [0.8,0.8,0.8];
    this._pickingColor  = vxl.go.picker.getColorFor(this); 
    this.vertices = vertices;
    this.normal = undefined; //cell normal
    this._calculateNormal();
};

/**
 * Calculates the cell normal
 * @private
 */
vxlCell.prototype._calculateNormal = function(){
    var p1 = vec3.subtract(this.vertices[1], this.vertices[0], vec3.create());
    var p2 = vec3.subtract(this.vertices[2], this.vertices[0], vec3.create());
    this.normal =  vec3.normalize(vec3.cross(p1,p2,vec3.create()));
};

/**
 * Returns an unidimensional array with the vertex information
 * [[a,b,c],[d,e,f],[g,h,i]] --> [a,b,c,d,e,f,g,h,i]
 */
vxlCell.prototype.getFlattenVertices = function(){
    var v = this.vertices;
    return [v[0][0],v[0][1],v[0][2],v[1][0],v[1][1],v[1][2],v[2][0],v[2][1],v[2][2]];
};
