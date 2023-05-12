import React from 'react';

const DirectoryHierarchyList = ({ directories }) => {
  const renderDirectoryHierarchy = (directory) => {
    return (
      <ul>
        {directory.subDirectories.map((subdirectory) => (
          <li className="fa-regular fa-diagram-nested" key={subdirectory.name}>
            {subdirectory.name}
            {subdirectory.subDirectories.length > 0 && renderDirectoryHierarchy(subdirectory)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      
      {directories.map((directory) => (
        <div key={directory.name}>
          <h4>{directory.name}</h4>
          {directory?.subDirectories?.length > 0 && renderDirectoryHierarchy(directory)}
        </div>
      ))}
    </div>
  );
};

export default DirectoryHierarchyList;