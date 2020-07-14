import request from '@/utils/request';

export async function queryTeam() {
  return request(`/api/v1/team`, {
    method: 'GET',
  });
}

export async function deleteTeam(teamID) {
  return request(`/api/v1/team/${teamID}`, {
    method: 'DELETE',
  });
}

export async function updateTeam(payload) {
  return request(`/api/v1/team`, {
    method: 'PUT',
    data: payload,
  });
}

export async function createTeam(payload) {
  return request(`/api/v1/team`, {
    method: 'POST',
    data: payload,
  });
}
