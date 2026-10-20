/**
 * Anatomical landmark placement for the two-dimensional Junior skeleton trainer.
 * Coordinates refer to the viewBox, not patient measurements or a 3D atlas.
 * Labels follow standard skeletal anatomy; these zones are only educational hints.
 */
export type SkeletonRegion = 'axial' | 'appendicular';
export interface BoneLandmark {
  id: string;
  label: string;
  x: number;
  y: number;
  radius: number;
  region: SkeletonRegion;
  role: string;
}
export const BONE_LANDMARKS: readonly BoneLandmark[] = [
  { id: 'cranium', label: 'Cranium', x: 260, y: 44, radius: 25, region: 'axial', role: 'Protects the brain' },
  { id: 'mandible', label: 'Mandible', x: 260, y: 78, radius: 17, region: 'axial', role: 'Forms the movable lower jaw' },
  { id: 'clavicle', label: 'Clavicle', x: 300, y: 112, radius: 22, region: 'appendicular', role: 'Connects shoulder girdle to sternum' },
  { id: 'scapula', label: 'Scapula', x: 215, y: 143, radius: 24, region: 'appendicular', role: 'Shoulder blade; anchors upper-limb muscles' },
  { id: 'sternum', label: 'Sternum', x: 260, y: 152, radius: 19, region: 'axial', role: 'Connects to ribs through costal cartilage' },
  { id: 'ribs', label: 'Rib cage', x: 294, y: 184, radius: 26, region: 'axial', role: 'Protects thoracic organs and supports respiration' },
  { id: 'humerus', label: 'Humerus', x: 173, y: 180, radius: 23, region: 'appendicular', role: 'Upper-arm bone articulating with scapula' },
  { id: 'radius', label: 'Radius', x: 137, y: 270, radius: 21, region: 'appendicular', role: 'Lateral forearm bone in anatomical position' },
  { id: 'ulna', label: 'Ulna', x: 377, y: 265, radius: 21, region: 'appendicular', role: 'Medial forearm bone in anatomical position' },
  { id: 'vertebrae', label: 'Vertebral column', x: 260, y: 232, radius: 21, region: 'axial', role: 'Protects the spinal cord and transfers load' },
  { id: 'pelvis', label: 'Pelvic girdle', x: 260, y: 287, radius: 24, region: 'appendicular', role: 'Transfers upper-body loads to the lower limbs' },
  { id: 'femur', label: 'Femur', x: 222, y: 342, radius: 22, region: 'appendicular', role: 'Thigh bone; longest bone in the body' },
  { id: 'patella', label: 'Patella', x: 305, y: 398, radius: 18, region: 'appendicular', role: 'Sesamoid bone supporting knee extension' },
  { id: 'tibia', label: 'Tibia', x: 214, y: 467, radius: 24, region: 'appendicular', role: 'Medial weight-bearing shin bone' },
  { id: 'fibula', label: 'Fibula', x: 329, y: 469, radius: 22, region: 'appendicular', role: 'Lateral lower-leg bone stabilizing the ankle' },
];

export function matchSkeletonDrop(boneId: string, x: number, y: number): {
  correct: boolean;
  nearest?: BoneLandmark;
} {
  const nearest = BONE_LANDMARKS.reduce<BoneLandmark | undefined>((best, item) =>
    !best || Math.hypot(item.x - x, item.y - y) < Math.hypot(best.x - x, best.y - y) ? item : best,
  undefined);
  const intended = BONE_LANDMARKS.find(item => item.id === boneId);
  return { correct: !!intended && !!nearest && nearest.id === boneId && Math.hypot(x - intended.x, y - intended.y) <= intended.radius + 18, nearest };
}

export function skeletonProgress(placed: ReadonlySet<string>) {
  const axial = BONE_LANDMARKS.filter(item => item.region === 'axial' && placed.has(item.id)).length;
  const appendicular = BONE_LANDMARKS.filter(item => item.region === 'appendicular' && placed.has(item.id)).length;
  return { axial, appendicular, total: placed.size, complete: placed.size === BONE_LANDMARKS.length };
}
