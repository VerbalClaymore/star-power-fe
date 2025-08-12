import ElonMuskAvatar from "@assets/ElonMusk_1755031196302.jpg";
import KanyeWestAvatar from "@assets/KanyeWest_1755031196474.jpg";
import TaylorSwiftAvatar from "@assets/TaylorSwift_1755031196475.jpg";
import TravisKelceAvatar from "@assets/TravisKelce_1755031196475.jpg";

export const getAvatarForActor = (actorName: string): string | null => {
  const name = actorName.toLowerCase();
  
  if (name.includes('taylor swift')) {
    return TaylorSwiftAvatar;
  }
  if (name.includes('travis kelce')) {
    return TravisKelceAvatar;
  }
  if (name.includes('elon musk')) {
    return ElonMuskAvatar;
  }
  if (name.includes('kanye west')) {
    return KanyeWestAvatar;
  }
  
  return null;
};

export const getAvatarById = (actorId: number): string | null => {
  // Map actor IDs to avatars based on the schema
  const idMap: Record<number, string> = {
    1: TaylorSwiftAvatar, // Taylor Swift
    2: ElonMuskAvatar,    // Elon Musk  
    3: TravisKelceAvatar, // Travis Kelce
    4: KanyeWestAvatar,   // Kanye West
  };
  
  return idMap[actorId] || null;
};