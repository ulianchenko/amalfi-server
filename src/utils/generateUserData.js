function generateUserData(firstName, secondName) {
  return {
    avatarPhoto: `https://ui-avatars.com/api/?name=${firstName}+${secondName}`,
  };
}


export default generateUserData;