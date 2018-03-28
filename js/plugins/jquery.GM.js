/*BinaryFile 转换二进制文件*/
var BinaryFile=function(a,b,c){var d=a,e=b||0,f=0;this.getRawData=function(){return d},"string"==typeof a?(f=c||d.length,this.getByteAt=function(a){return 255&d.charCodeAt(a+e)},this.getBytesAt=function(a,b){for(var c=[],f=0;b>f;f++)c[f]=255&d.charCodeAt(a+f+e);return c}):"unknown"==typeof a&&(f=c||IEBinary_getLength(d),this.getByteAt=function(a){return IEBinary_getByteAt(d,a+e)},this.getBytesAt=function(a,b){return new VBArray(IEBinary_getBytesAt(d,a+e,b)).toArray()}),this.getLength=function(){return f},this.getSByteAt=function(a){var b=this.getByteAt(a);return b>127?b-256:b},this.getShortAt=function(a,b){var c=b?(this.getByteAt(a)<<8)+this.getByteAt(a+1):(this.getByteAt(a+1)<<8)+this.getByteAt(a);return 0>c&&(c+=65536),c},this.getSShortAt=function(a,b){var c=this.getShortAt(a,b);return c>32767?c-65536:c},this.getLongAt=function(a,b){var c=this.getByteAt(a),d=this.getByteAt(a+1),e=this.getByteAt(a+2),f=this.getByteAt(a+3),g=b?(((c<<8)+d<<8)+e<<8)+f:(((f<<8)+e<<8)+d<<8)+c;return 0>g&&(g+=4294967296),g},this.getSLongAt=function(a,b){var c=this.getLongAt(a,b);return c>2147483647?c-4294967296:c},this.getStringAt=function(a,b){for(var c=[],d=this.getBytesAt(a,b),e=0;b>e;e++)c[e]=String.fromCharCode(d[e]);return c.join("")},this.getCharAt=function(a){return String.fromCharCode(this.getByteAt(a))},this.toBase64=function(){return window.btoa(d)},this.fromBase64=function(a){d=window.atob(a)}},BinaryAjax=function(){function a(){var a=null;return window.ActiveXObject?a=new ActiveXObject("Microsoft.XMLHTTP"):window.XMLHttpRequest&&(a=new XMLHttpRequest),a}function b(b,c,d){var e=a();e?(c&&("undefined"!=typeof e.onload?e.onload=function(){"200"==e.status?c(this):d&&d(),e=null}:e.onreadystatechange=function(){4==e.readyState&&("200"==e.status?c(this):d&&d(),e=null)}),e.open("HEAD",b,!0),e.send(null)):d&&d()}function c(b,c,d,e,f,g){var h=a();if(h){var i=0;e&&!f&&(i=e[0]);var j=0;e&&(j=e[1]-e[0]+1),c&&("undefined"!=typeof h.onload?h.onload=function(){"200"==h.status||"206"==h.status||"0"==h.status?(h.binaryResponse=new BinaryFile(h.responseText,i,j),h.fileSize=g||h.getResponseHeader("Content-Length"),c(h)):d&&d(),h=null}:h.onreadystatechange=function(){if(4==h.readyState){if("200"==h.status||"206"==h.status||"0"==h.status){var a={status:h.status,binaryResponse:new BinaryFile("unknown"==typeof h.responseBody?h.responseBody:h.responseText,i,j),fileSize:g||h.getResponseHeader("Content-Length")};c(a)}else d&&d();h=null}}),h.open("GET",b,!0),h.overrideMimeType&&h.overrideMimeType("text/plain; charset=x-user-defined"),e&&f&&h.setRequestHeader("Range","bytes="+e[0]+"-"+e[1]),h.setRequestHeader("If-Modified-Since","Sat, 1 Jan 1970 00:00:00 GMT"),h.send(null)}else d&&d()}return function(a,d,e,f){f?b(a,function(b){var i,j,g=parseInt(b.getResponseHeader("Content-Length"),10),h=b.getResponseHeader("Accept-Ranges");i=f[0],f[0]<0&&(i+=g),j=i+f[1]-1,c(a,d,e,[i,j],"bytes"==h,g)}):c(a,d,e)}}();document.write("<script type='text/vbscript'>\r\nFunction IEBinary_getByteAt(strBinary, iOffset)\r\n	IEBinary_getByteAt = AscB(MidB(strBinary, iOffset + 1, 1))\r\nEnd Function\r\nFunction IEBinary_getBytesAt(strBinary, iOffset, iLength)\r\n  Dim aBytes()\r\n  ReDim aBytes(iLength - 1)\r\n  For i = 0 To iLength - 1\r\n   aBytes(i) = IEBinary_getByteAt(strBinary, iOffset + i)\r\n  Next\r\n  IEBinary_getBytesAt = aBytes\r\nEnd Function\r\nFunction IEBinary_getLength(strBinary)\r\n	IEBinary_getLength = LenB(strBinary)\r\nEnd Function\r\n</script>\r\n");
/*EXIF 获取*/
var EXIF={};!function(){function b(a,b,c){a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent&&a.attachEvent("on"+b,c)}function c(a){return!!a.exifdata}function d(a,b){BinaryAjax(a.src,function(c){var d=e(c.binaryResponse);a.exifdata=d||{},b&&b()})}function e(b){if(255!=b.getByteAt(0)||216!=b.getByteAt(1))return!1;for(var d=2,e=b.getLength();e>d;){if(255!=b.getByteAt(d))return a&&console.log("Not a valid marker at offset "+d+", found: "+b.getByteAt(d)),!1;var f=b.getByteAt(d+1);if(22400==f)return a&&console.log("Found 0xFFE1 marker"),h(b,d+4,b.getShortAt(d+2,!0)-2);if(225==f)return a&&console.log("Found 0xFFE1 marker"),h(b,d+4,b.getShortAt(d+2,!0)-2);d+=2+b.getShortAt(d+2,!0)}}function f(b,c,d,e,f){for(var h=b.getShortAt(d,f),i={},j=0;h>j;j++){var k=d+12*j+2,l=e[b.getShortAt(k,f)];!l&&a&&console.log("Unknown tag: "+b.getShortAt(k,f)),i[l]=g(b,k,c,d,f)}return i}function g(a,b,c,d,e){var f=a.getShortAt(b+2,e),g=a.getLongAt(b+4,e),h=a.getLongAt(b+8,e)+c;switch(f){case 1:case 7:if(1==g)return a.getByteAt(b+8,e);for(var i=g>4?h:b+8,j=[],k=0;g>k;k++)j[k]=a.getByteAt(i+k);return j;case 2:var l=g>4?h:b+8;return a.getStringAt(l,g-1);case 3:if(1==g)return a.getShortAt(b+8,e);for(var i=g>2?h:b+8,j=[],k=0;g>k;k++)j[k]=a.getShortAt(i+2*k,e);return j;case 4:if(1==g)return a.getLongAt(b+8,e);for(var j=[],k=0;g>k;k++)j[k]=a.getLongAt(h+4*k,e);return j;case 5:if(1==g)return a.getLongAt(h,e)/a.getLongAt(h+4,e);for(var j=[],k=0;g>k;k++)j[k]=a.getLongAt(h+8*k,e)/a.getLongAt(h+4+8*k,e);return j;case 9:if(1==g)return a.getSLongAt(b+8,e);for(var j=[],k=0;g>k;k++)j[k]=a.getSLongAt(h+4*k,e);return j;case 10:if(1==g)return a.getSLongAt(h,e)/a.getSLongAt(h+4,e);for(var j=[],k=0;g>k;k++)j[k]=a.getSLongAt(h+8*k,e)/a.getSLongAt(h+4+8*k,e);return j}}function h(b,c){if("Exif"!=b.getStringAt(c,4))return a&&console.log("Not valid EXIF data! "+b.getStringAt(c,4)),!1;var e,g=c+6;if(18761==b.getShortAt(g))e=!1;else{if(19789!=b.getShortAt(g))return a&&console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)"),!1;e=!0}if(42!=b.getShortAt(g+2,e))return a&&console.log("Not valid TIFF data! (no 0x002A)"),!1;if(8!=b.getLongAt(g+4,e))return a&&console.log("Not valid TIFF data! (First offset not 8)",b.getShortAt(g+4,e)),!1;var h=f(b,g,g+8,EXIF.TiffTags,e);if(h.ExifIFDPointer){var i=f(b,g,g+h.ExifIFDPointer,EXIF.Tags,e);for(var j in i){switch(j){case"LightSource":case"Flash":case"MeteringMode":case"ExposureProgram":case"SensingMethod":case"SceneCaptureType":case"SceneType":case"CustomRendered":case"WhiteBalance":case"GainControl":case"Contrast":case"Saturation":case"Sharpness":case"SubjectDistanceRange":case"FileSource":i[j]=EXIF.StringValues[j][i[j]];break;case"ExifVersion":case"FlashpixVersion":i[j]=String.fromCharCode(i[j][0],i[j][1],i[j][2],i[j][3]);break;case"ComponentsConfiguration":i[j]=EXIF.StringValues.Components[i[j][0]]+EXIF.StringValues.Components[i[j][1]]+EXIF.StringValues.Components[i[j][2]]+EXIF.StringValues.Components[i[j][3]]}h[j]=i[j]}}if(h.GPSInfoIFDPointer){var k=f(b,g,g+h.GPSInfoIFDPointer,EXIF.GPSTags,e);for(var j in k){switch(j){case"GPSVersionID":k[j]=k[j][0]+"."+k[j][1]+"."+k[j][2]+"."+k[j][3]}h[j]=k[j]}}return h}function i(){for(var a=document.getElementsByTagName("img"),c=0;c<a.length;c++)"true"==a[c].getAttribute("exif")&&(a[c].complete?EXIF.getData(a[c]):b(a[c],"load",function(){EXIF.getData(this)}))}var a=!1;EXIF.Tags={36864:"ExifVersion",40960:"FlashpixVersion",40961:"ColorSpace",40962:"PixelXDimension",40963:"PixelYDimension",37121:"ComponentsConfiguration",37122:"CompressedBitsPerPixel",37500:"MakerNote",37510:"UserComment",40964:"RelatedSoundFile",36867:"DateTimeOriginal",36868:"DateTimeDigitized",37520:"SubsecTime",37521:"SubsecTimeOriginal",37522:"SubsecTimeDigitized",33434:"ExposureTime",33437:"FNumber",34850:"ExposureProgram",34852:"SpectralSensitivity",34855:"ISOSpeedRatings",34856:"OECF",37377:"ShutterSpeedValue",37378:"ApertureValue",37379:"BrightnessValue",37380:"ExposureBias",37381:"MaxApertureValue",37382:"SubjectDistance",37383:"MeteringMode",37384:"LightSource",37385:"Flash",37396:"SubjectArea",37386:"FocalLength",41483:"FlashEnergy",41484:"SpatialFrequencyResponse",41486:"FocalPlaneXResolution",41487:"FocalPlaneYResolution",41488:"FocalPlaneResolutionUnit",41492:"SubjectLocation",41493:"ExposureIndex",41495:"SensingMethod",41728:"FileSource",41729:"SceneType",41730:"CFAPattern",41985:"CustomRendered",41986:"ExposureMode",41987:"WhiteBalance",41988:"DigitalZoomRation",41989:"FocalLengthIn35mmFilm",41990:"SceneCaptureType",41991:"GainControl",41992:"Contrast",41993:"Saturation",41994:"Sharpness",41995:"DeviceSettingDescription",41996:"SubjectDistanceRange",40965:"InteroperabilityIFDPointer",42016:"ImageUniqueID"},EXIF.TiffTags={256:"ImageWidth",257:"ImageHeight",34665:"ExifIFDPointer",34853:"GPSInfoIFDPointer",40965:"InteroperabilityIFDPointer",258:"BitsPerSample",259:"Compression",262:"PhotometricInterpretation",274:"Orientation",277:"SamplesPerPixel",284:"PlanarConfiguration",530:"YCbCrSubSampling",531:"YCbCrPositioning",282:"XResolution",283:"YResolution",296:"ResolutionUnit",273:"StripOffsets",278:"RowsPerStrip",279:"StripByteCounts",513:"JPEGInterchangeFormat",514:"JPEGInterchangeFormatLength",301:"TransferFunction",318:"WhitePoint",319:"PrimaryChromaticities",529:"YCbCrCoefficients",532:"ReferenceBlackWhite",306:"DateTime",270:"ImageDescription",271:"Make",272:"Model",305:"Software",315:"Artist",33432:"Copyright"},EXIF.GPSTags={0:"GPSVersionID",1:"GPSLatitudeRef",2:"GPSLatitude",3:"GPSLongitudeRef",4:"GPSLongitude",5:"GPSAltitudeRef",6:"GPSAltitude",7:"GPSTimeStamp",8:"GPSSatellites",9:"GPSStatus",10:"GPSMeasureMode",11:"GPSDOP",12:"GPSSpeedRef",13:"GPSSpeed",14:"GPSTrackRef",15:"GPSTrack",16:"GPSImgDirectionRef",17:"GPSImgDirection",18:"GPSMapDatum",19:"GPSDestLatitudeRef",20:"GPSDestLatitude",21:"GPSDestLongitudeRef",22:"GPSDestLongitude",23:"GPSDestBearingRef",24:"GPSDestBearing",25:"GPSDestDistanceRef",26:"GPSDestDistance",27:"GPSProcessingMethod",28:"GPSAreaInformation",29:"GPSDateStamp",30:"GPSDifferential"},EXIF.StringValues={ExposureProgram:{0:"Not defined",1:"Manual",2:"Normal program",3:"Aperture priority",4:"Shutter priority",5:"Creative program",6:"Action program",7:"Portrait mode",8:"Landscape mode"},MeteringMode:{0:"Unknown",1:"Average",2:"CenterWeightedAverage",3:"Spot",4:"MultiSpot",5:"Pattern",6:"Partial",255:"Other"},LightSource:{0:"Unknown",1:"Daylight",2:"Fluorescent",3:"Tungsten (incandescent light)",4:"Flash",9:"Fine weather",10:"Cloudy weather",11:"Shade",12:"Daylight fluorescent (D 5700 - 7100K)",13:"Day white fluorescent (N 4600 - 5400K)",14:"Cool white fluorescent (W 3900 - 4500K)",15:"White fluorescent (WW 3200 - 3700K)",17:"Standard light A",18:"Standard light B",19:"Standard light C",20:"D55",21:"D65",22:"D75",23:"D50",24:"ISO studio tungsten",255:"Other"},Flash:{0:"Flash did not fire",1:"Flash fired",5:"Strobe return light not detected",7:"Strobe return light detected",9:"Flash fired, compulsory flash mode",13:"Flash fired, compulsory flash mode, return light not detected",15:"Flash fired, compulsory flash mode, return light detected",16:"Flash did not fire, compulsory flash mode",24:"Flash did not fire, auto mode",25:"Flash fired, auto mode",29:"Flash fired, auto mode, return light not detected",31:"Flash fired, auto mode, return light detected",32:"No flash function",65:"Flash fired, red-eye reduction mode",69:"Flash fired, red-eye reduction mode, return light not detected",71:"Flash fired, red-eye reduction mode, return light detected",73:"Flash fired, compulsory flash mode, red-eye reduction mode",77:"Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",79:"Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",89:"Flash fired, auto mode, red-eye reduction mode",93:"Flash fired, auto mode, return light not detected, red-eye reduction mode",95:"Flash fired, auto mode, return light detected, red-eye reduction mode"},SensingMethod:{1:"Not defined",2:"One-chip color area sensor",3:"Two-chip color area sensor",4:"Three-chip color area sensor",5:"Color sequential area sensor",7:"Trilinear sensor",8:"Color sequential linear sensor"},SceneCaptureType:{0:"Standard",1:"Landscape",2:"Portrait",3:"Night scene"},SceneType:{1:"Directly photographed"},CustomRendered:{0:"Normal process",1:"Custom process"},WhiteBalance:{0:"Auto white balance",1:"Manual white balance"},GainControl:{0:"None",1:"Low gain up",2:"High gain up",3:"Low gain down",4:"High gain down"},Contrast:{0:"Normal",1:"Soft",2:"Hard"},Saturation:{0:"Normal",1:"Low saturation",2:"High saturation"},Sharpness:{0:"Normal",1:"Soft",2:"Hard"},SubjectDistanceRange:{0:"Unknown",1:"Macro",2:"Close view",3:"Distant view"},FileSource:{3:"DSC"},Components:{0:"",1:"Y",2:"Cb",3:"Cr",4:"R",5:"G",6:"B"}},EXIF.getData=function(a,b){return a.complete?(c(a)?b&&b():d(a,b),!0):!1},EXIF.getTag=function(a,b){return c(a)?a.exifdata[b]:void 0},EXIF.getAllTags=function(a){if(!c(a))return{};var b=a.exifdata,d={};for(var e in b)b.hasOwnProperty(e)&&(d[e]=b[e]);return d},EXIF.pretty=function(a){if(!c(a))return"";var b=a.exifdata,d="";for(var e in b)b.hasOwnProperty(e)&&(d+="object"==typeof b[e]?e+" : ["+b[e].length+" values]\r\n":e+" : "+b[e]+"\r\n");return d},EXIF.readFromBinaryFile=function(a){return e(a)},b(window,"load",i)}();
//mobileBUGFix
/* jpeg_encoder_basic.js  for android jpeg压缩质量修复 */
function JPEGEncoder(a){function I(a){var c,i,j,k,l,m,n,o,p,b=[16,11,10,16,24,40,51,61,12,12,14,19,26,58,60,55,14,13,16,24,40,57,69,56,14,17,22,29,51,87,80,62,18,22,37,56,68,109,103,77,24,35,55,64,81,104,113,92,49,64,78,87,103,121,120,101,72,92,95,98,112,100,103,99];for(c=0;64>c;c++)i=d((b[c]*a+50)/100),1>i?i=1:i>255&&(i=255),e[z[c]]=i;for(j=[17,18,24,47,99,99,99,99,18,21,26,66,99,99,99,99,24,26,56,99,99,99,99,99,47,66,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99],k=0;64>k;k++)l=d((j[k]*a+50)/100),1>l?l=1:l>255&&(l=255),f[z[k]]=l;for(m=[1,1.387039845,1.306562965,1.175875602,1,.785694958,.5411961,.275899379],n=0,o=0;8>o;o++)for(p=0;8>p;p++)g[n]=1/(8*e[z[n]]*m[o]*m[p]),h[n]=1/(8*f[z[n]]*m[o]*m[p]),n++}function J(a,b){var f,g,c=0,d=0,e=new Array;for(f=1;16>=f;f++){for(g=1;g<=a[f];g++)e[b[d]]=[],e[b[d]][0]=c,e[b[d]][1]=f,d++,c++;c*=2}return e}function K(){i=J(A,B),j=J(E,F),k=J(C,D),l=J(G,H)}function L(){var c,d,e,a=1,b=2;for(c=1;15>=c;c++){for(d=a;b>d;d++)n[32767+d]=c,m[32767+d]=[],m[32767+d][1]=c,m[32767+d][0]=d;for(e=-(b-1);-a>=e;e++)n[32767+e]=c,m[32767+e]=[],m[32767+e][1]=c,m[32767+e][0]=b-1+e;a<<=1,b<<=1}}function M(){for(var a=0;256>a;a++)x[a]=19595*a,x[a+256>>0]=38470*a,x[a+512>>0]=7471*a+32768,x[a+768>>0]=-11059*a,x[a+1024>>0]=-21709*a,x[a+1280>>0]=32768*a+8421375,x[a+1536>>0]=-27439*a,x[a+1792>>0]=-5329*a}function N(a){for(var b=a[0],c=a[1]-1;c>=0;)b&1<<c&&(r|=1<<s),c--,s--,0>s&&(255==r?(O(255),O(0)):O(r),s=7,r=0)}function O(a){q.push(w[a])}function P(a){O(255&a>>8),O(255&a)}function Q(a,b){var c,d,e,f,g,h,i,j,l,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$,_,k=0;const m=8,n=64;for(l=0;m>l;++l)c=a[k],d=a[k+1],e=a[k+2],f=a[k+3],g=a[k+4],h=a[k+5],i=a[k+6],j=a[k+7],p=c+j,q=c-j,r=d+i,s=d-i,t=e+h,u=e-h,v=f+g,w=f-g,x=p+v,y=p-v,z=r+t,A=r-t,a[k]=x+z,a[k+4]=x-z,B=.707106781*(A+y),a[k+2]=y+B,a[k+6]=y-B,x=w+u,z=u+s,A=s+q,C=.382683433*(x-A),D=.5411961*x+C,E=1.306562965*A+C,F=.707106781*z,G=q+F,H=q-F,a[k+5]=H+D,a[k+3]=H-D,a[k+1]=G+E,a[k+7]=G-E,k+=8;for(k=0,l=0;m>l;++l)c=a[k],d=a[k+8],e=a[k+16],f=a[k+24],g=a[k+32],h=a[k+40],i=a[k+48],j=a[k+56],I=c+j,J=c-j,K=d+i,L=d-i,M=e+h,N=e-h,O=f+g,P=f-g,Q=I+O,R=I-O,S=K+M,T=K-M,a[k]=Q+S,a[k+32]=Q-S,U=.707106781*(T+R),a[k+16]=R+U,a[k+48]=R-U,Q=P+N,S=N+L,T=L+J,V=.382683433*(Q-T),W=.5411961*Q+V,X=1.306562965*T+V,Y=.707106781*S,Z=J+Y,$=J-Y,a[k+40]=$+W,a[k+24]=$-W,a[k+8]=Z+X,a[k+56]=Z-X,k++;for(l=0;n>l;++l)_=a[l]*b[l],o[l]=_>0?0|_+.5:0|_-.5;return o}function R(){P(65504),P(16),O(74),O(70),O(73),O(70),O(0),O(1),O(1),O(0),P(1),P(1),O(0),O(0)}function S(a,b){P(65472),P(17),O(8),P(b),P(a),O(3),O(1),O(17),O(0),O(2),O(17),O(1),O(3),O(17),O(1)}function T(){var a,b;for(P(65499),P(132),O(0),a=0;64>a;a++)O(e[a]);for(O(1),b=0;64>b;b++)O(f[b])}function U(){var a,b,c,d,e,f,g,h;for(P(65476),P(418),O(0),a=0;16>a;a++)O(A[a+1]);for(b=0;11>=b;b++)O(B[b]);for(O(16),c=0;16>c;c++)O(C[c+1]);for(d=0;161>=d;d++)O(D[d]);for(O(1),e=0;16>e;e++)O(E[e+1]);for(f=0;11>=f;f++)O(F[f]);for(O(17),g=0;16>g;g++)O(G[g+1]);for(h=0;161>=h;h++)O(H[h])}function V(){P(65498),P(12),O(3),O(1),O(0),O(2),O(17),O(3),O(17),O(0),O(63),O(0)}function W(a,b,c,d,e){var h,l,o,q,r,s,t,u,v,w,f=e[0],g=e[240];const i=16,j=63,k=64;for(l=Q(a,b),o=0;k>o;++o)p[z[o]]=l[o];for(q=p[0]-c,c=p[0],0==q?N(d[0]):(h=32767+q,N(d[n[h]]),N(m[h])),r=63;r>0&&0==p[r];r--);if(0==r)return N(f),c;for(s=1;r>=s;){for(u=s;0==p[s]&&r>=s;++s);if(v=s-u,v>=i){for(t=v>>4,w=1;t>=w;++w)N(g);v=15&v}h=32767+p[s],N(e[(v<<4)+n[h]]),N(m[h]),s++}return r!=j&&N(f),c}function X(){var b,a=String.fromCharCode;for(b=0;256>b;b++)w[b]=a(b)}function Y(a){if(0>=a&&(a=1),a>100&&(a=100),y!=a){var b=0;b=50>a?Math.floor(5e3/a):Math.floor(200-2*a),I(b),y=a,console.log("Quality set to: "+a+"%")}}function Z(){var c,b=(new Date).getTime();a||(a=50),X(),K(),L(),M(),Y(a),c=(new Date).getTime()-b,console.log("Initialization "+c+"ms")}var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H;Math.round,d=Math.floor,e=new Array(64),f=new Array(64),g=new Array(64),h=new Array(64),m=new Array(65535),n=new Array(65535),o=new Array(64),p=new Array(64),q=[],r=0,s=7,t=new Array(64),u=new Array(64),v=new Array(64),w=new Array(256),x=new Array(2048),z=[0,1,5,6,14,15,27,28,2,4,7,13,16,26,29,42,3,8,12,17,25,30,41,43,9,11,18,24,31,40,44,53,10,19,23,32,39,45,52,54,20,22,33,38,46,51,55,60,21,34,37,47,50,56,59,61,35,36,48,49,57,58,62,63],A=[0,0,1,5,1,1,1,1,1,1,0,0,0,0,0,0,0],B=[0,1,2,3,4,5,6,7,8,9,10,11],C=[0,0,2,1,3,3,2,4,3,5,5,4,4,0,0,1,125],D=[1,2,3,0,4,17,5,18,33,49,65,6,19,81,97,7,34,113,20,50,129,145,161,8,35,66,177,193,21,82,209,240,36,51,98,114,130,9,10,22,23,24,25,26,37,38,39,40,41,42,52,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,225,226,227,228,229,230,231,232,233,234,241,242,243,244,245,246,247,248,249,250],E=[0,0,3,1,1,1,1,1,1,1,1,1,0,0,0,0,0],F=[0,1,2,3,4,5,6,7,8,9,10,11],G=[0,0,2,1,2,4,4,3,4,7,5,4,4,0,1,2,119],H=[0,1,2,3,17,4,5,33,49,6,18,65,81,7,97,113,19,34,50,129,8,20,66,145,161,177,193,9,35,51,82,240,21,98,114,209,10,22,36,52,225,37,241,23,24,25,26,38,39,40,41,42,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,130,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,226,227,228,229,230,231,232,233,234,242,243,244,245,246,247,248,249,250],this.encode=function(a,b){var d,e,f,m,n,o,p,y,z,A,B,C,D,E,F,G,H,I,J,K,c=(new Date).getTime();for(b&&Y(b),q=new Array,r=0,s=7,P(65496),R(),T(),S(a.width,a.height),U(),V(),d=0,e=0,f=0,r=0,s=7,this.encode.displayName="_encode_",m=a.data,n=a.width,o=a.height,p=4*n,z=0;o>z;){for(y=0;p>y;){for(D=p*z+y,E=D,F=-1,G=0,H=0;64>H;H++)G=H>>3,F=4*(7&H),E=D+G*p+F,z+G>=o&&(E-=p*(z+1+G-o)),y+F>=p&&(E-=y+F-p+4),A=m[E++],B=m[E++],C=m[E++],t[H]=(x[A]+x[B+256>>0]+x[C+512>>0]>>16)-128,u[H]=(x[A+768>>0]+x[B+1024>>0]+x[C+1280>>0]>>16)-128,v[H]=(x[A+1280>>0]+x[B+1536>>0]+x[C+1792>>0]>>16)-128;d=W(t,g,d,i,k),e=W(u,h,e,j,l),f=W(v,h,f,j,l),y+=32}z+=8}return s>=0&&(I=[],I[1]=s+1,I[0]=(1<<s+1)-1,N(I)),P(65497),J="data:image/jpeg;base64,"+btoa(q.join("")),q=[],K=(new Date).getTime()-c,console.log("Encoding time: "+K+"ms"),J},Z()}function getImageDataFromImage(a){var d,b="string"==typeof a?document.getElementById(a):a,c=document.createElement("canvas");return c.width=b.width,c.height=b.height,d=c.getContext("2d"),d.drawImage(b,0,0),d.getImageData(0,0,c.width,c.height)}
/* megapix-image.js for IOS(iphone5+) drawImage画面扭曲修复  */
!function(){function a(a){var d,e,b=a.naturalWidth,c=a.naturalHeight;return b*c>1048576?(d=document.createElement("canvas"),d.width=d.height=1,e=d.getContext("2d"),e.drawImage(a,-b+1,0),0===e.getImageData(0,0,1,1).data[3]):!1}function b(a,b,c){var e,f,g,h,i,j,k,d=document.createElement("canvas");for(d.width=1,d.height=c,e=d.getContext("2d"),e.drawImage(a,0,0),f=e.getImageData(0,0,1,c).data,g=0,h=c,i=c;i>g;)j=f[4*(i-1)+3],0===j?h=i:g=i,i=h+g>>1;return k=i/c,0===k?1:k}function c(a,b,c){var e=document.createElement("canvas");return d(a,e,b,c),e.toDataURL("image/jpeg",b.quality||.8)}function d(c,d,f,g){var m,n,o,p,q,r,s,t,u,v,w,h=c.naturalWidth,i=c.naturalHeight,j=f.width,k=f.height,l=d.getContext("2d");for(l.save(),e(d,l,j,k,f.orientation),m=a(c),m&&(h/=2,i/=2),n=1024,o=document.createElement("canvas"),o.width=o.height=n,p=o.getContext("2d"),q=g?b(c,h,i):1,r=Math.ceil(n*j/h),s=Math.ceil(n*k/i/q),t=0,u=0;i>t;){for(v=0,w=0;h>v;)p.clearRect(0,0,n,n),p.drawImage(c,-v,-t),l.drawImage(o,0,0,n,n,w,u,r,s),v+=n,w+=r;t+=n,u+=s}l.restore(),o=p=null}function e(a,b,c,d,e){switch(e){case 5:case 6:case 7:case 8:a.width=d,a.height=c;break;default:a.width=c,a.height=d}switch(e){case 2:b.translate(c,0),b.scale(-1,1);break;case 3:b.translate(c,d),b.rotate(Math.PI);break;case 4:b.translate(0,d),b.scale(1,-1);break;case 5:b.rotate(.5*Math.PI),b.scale(1,-1);break;case 6:b.rotate(.5*Math.PI),b.translate(0,-d);break;case 7:b.rotate(.5*Math.PI),b.translate(c,-d),b.scale(-1,1);break;case 8:b.rotate(-.5*Math.PI),b.translate(-c,0)}}function f(a){var b,c,d;if(window.Blob&&a instanceof Blob){if(b=new Image,c=window.URL&&window.URL.createObjectURL?window.URL:window.webkitURL&&window.webkitURL.createObjectURL?window.webkitURL:null,!c)throw Error("No createObjectURL function found to create blob url");b.src=c.createObjectURL(a),this.blob=a,a=b}a.naturalWidth||a.naturalHeight||(d=this,a.onload=function(){var b,c,a=d.imageLoadListeners;if(a)for(d.imageLoadListeners=null,b=0,c=a.length;c>b;b++)a[b]()},this.imageLoadListeners=[]),this.srcImage=a}f.prototype.render=function(a,b,e){var f,g,h,i,j,k,l,m,n,o,p;if(this.imageLoadListeners)return f=this,this.imageLoadListeners.push(function(){f.render(a,b,e)}),void 0;b=b||{},g=this.srcImage.naturalWidth,h=this.srcImage.naturalHeight,i=b.width,j=b.height,k=b.maxWidth,l=b.maxHeight,m=!this.blob||"image/jpeg"===this.blob.type,i&&!j?j=h*i/g<<0:j&&!i?i=g*j/h<<0:(i=g,j=h),k&&i>k&&(i=k,j=h*i/g<<0),l&&j>l&&(j=l,i=g*j/h<<0),n={width:i,height:j};for(o in b)n[o]=b[o];p=a.tagName.toLowerCase(),"img"===p?a.src=c(this.srcImage,n,m):"canvas"===p&&d(this.srcImage,a,n,m),"function"==typeof this.onrender&&this.onrender(a),e&&e()},"function"==typeof define&&define.amd?define([],function(){return f}):this.MegaPixImage=f}();
/**
 * Graphic Image
 * 图形处理插件（只支持jpg,png图片的操作）
 *
 * @作者: 中恒玖联前端团队
 * @版权: 中恒玖联
 */
(function ($) {

    $.DM = function (element, options) {

        // 插件的默认选项
        var defaults = {
            width: 480, //压缩后图片的宽度（高度会自动适应）
            quality: 0.8, //压缩后图片的质量（0.1-1）
            showToast: true, //是否显示 提示信息
            isGetEXIF: true,
            toastText: "如果点击无反映请升级系统版本或微信版本", //toast提示信息
            toastAnimation: 500, // toast动画时间
            toastShowTime: 2000, //toast显示时间
            beforeFun: function(){ //图片选择后的载入
            },
            completeFun: function (result) { //图片生成完毕后调用的方法
            },
            errorFun: function (file) { //错误的回调
            }
        };
        var plugin = this;

        plugin.settings = {};

        var $element = $(element), // jQuery版本的DOM元素的引用
            element = element;    // 实际的DOM元素的引用

        var __TIMER__;
        plugin.init = function () {

            var settings = plugin.settings = $.extend({}, defaults, options);
            // 初始化代码

            settings._UUID = plugin.createUUID();

            settings.$inputFileHtml = $('<input type="file" class="gm-input-file" accept="image/*" id="' + settings._UUID + '">');
            $element.append(settings.$inputFileHtml);
            settings.$inputFileHtml.on('change', function (e) {
                var file = this.files[0];

                settings.beforeFun && (settings.beforeFun.call(file));
                var reader = new FileReader();
                reader.onload = function(e){
                    var result = this.result, exif;
                    if(settings.isGetEXIF){
                        var base64 = result.substr(result.indexOf(',') + 1);
                        var binary = atob(base64);
                        var binaryData = new BinaryFile(binary);
                        exif = EXIF.readFromBinaryFile(binaryData);

                    }
                    createBase64(result, file, exif);
                };
                reader.readAsDataURL(file);

                //var URL = window.URL || window.webkitURL;
                //var blob = URL.createObjectURL(file);
                //createBase64(blob, file);
                this.value = ''; // 清空临时数据
            });

            if (settings.showToast) {
                var $gm_toast = $(".gm-toast");
                if (!$gm_toast.length) {
                    $gm_toast = $('<div class="gm-toast"><b>' + settings.toastText + '</b></div>');
                    $("body").append($gm_toast);
                }
                settings._$gm_toast = $gm_toast;

                $element.click(function () {
                    clearTimeout(__TIMER__);
                    settings._$gm_toast.stop().css("display", "none").fadeIn(settings.toastAnimation, function () {
                        __TIMER__ = setTimeout(function () {
                            clearTimeout(__TIMER__);
                            settings._$gm_toast.stop().fadeOut(settings.toastAnimation);
                        }, settings.toastShowTime);
                    });
                });
            }
        };

        plugin.createUUID = function () {  //UUID生成器
            var U = function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            return (U() + U() + "-" + U() + "-" + new Date().getTime().toString(32));
        };

        var createBase64 = function (dataUrl, file, exif) {
            var settings = plugin.settings;
            var img = new Image();
            img.onload = function () {
                var self = this;
                //生成缩放比例
                var w = self.width,
                    h = self.height,
                    scale = w / h;

                w = Math.round(settings.width || w);
                h = Math.round(w / scale);

                //生成canvas
                var canvas = document.createElement('canvas');
                //$("body").append($(canvas));
                var ctx = canvas.getContext('2d');
                canvas.width = w;
                canvas.height = h;
                //ctx.drawImage(self, 0, 0, w, h);
                var orientation = exif ? exif.Orientation : 1;
                switch (orientation) {
                    case 3:
                        //180向右旋转
                        ctx.translate(canvas.width, canvas.height);
                        ctx.rotate(Math.PI / 180 * 180);
                        ctx.drawImage(self, 0, 0, w, h);
                        break;
                    case 6:
                        //90向右旋转
                        var ht = h;
                        h = w;
                        w = ht;
                        canvas.width = w;
                        canvas.height = h;
                        ctx.translate(canvas.width, 0);
                        ctx.rotate(Math.PI / 180 * 90);
                        ctx.drawImage(self, 0, 0, h, w);
                        break;
                    case 8:
                        //需要90度向左旋转。就是右旋转270度
                        var ht = h;
                        h = w;
                        w = ht;
                        canvas.width = w;
                        canvas.height = h;
                        ctx.translate(0, canvas.height);
                        ctx.rotate(Math.PI / 180 * 270);
                        ctx.drawImage(self, 0, 0, h, w);
                        break;
                    default :
                        //正常状态。
                        ctx.drawImage(self, 0, 0, w, h);
                        break;
                }


                /**
                 * 生成base64
                 * 兼容修复移动设备需要引入mobileBUGFix.js
                 */
                var base64 = canvas.toDataURL('image/jpeg', settings.quality);
                // 修复IOS
                if (navigator.userAgent.match(/iphone/i)) {
                    var mpImg = new MegaPixImage(base64);
                    mpImg.render(canvas, {
                        maxWidth: w,
                        maxHeight: h,
                        quality: settings.quality
                    });
                    base64 = canvas.toDataURL('image/jpeg', settings.quality);
                }else if(navigator.userAgent.match(/Android/i)){
                    // 修复Android
                    var encoder = new JPEGEncoder();
                    base64 = encoder.encode(ctx.getImageData(0, 0, w, h), settings.quality * 100);
                }

                // 生成结果
                var result = {
                    file: file,
                    image: img,
                    base64: base64,
                    clearBase64: base64.substr(base64.indexOf(',') + 1),
                    exif: exif
                };


                // 执行后函数
                settings.completeFun && (settings.completeFun.call(element, result));
            };

            img.onerror = function () {
                settings.errorFun && (settings.errorFun.call(element, file));
            };

            img.src = dataUrl;
        };

        // 启动插件!
        plugin.init();
    };

    // 将插件添加到 jQuery.fn 对象
    $.fn.DM = function (options) {
        return this.each(function () {
            if (undefined == $(this).data('GM')) {
                var plugin = new $.DM(this, options);
                $(this).data('GM', plugin);
            }
        });

    }

})(jQuery);
