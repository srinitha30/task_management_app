import { useEffect, useState } from "react";
import {
  Users,
  Mail,
  UserRound,
  ShieldCheck,
} from "lucide-react";

import "./Team.css";

const API_URL =
  "http://localhost:5000/api/auth/users";

function Team() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch users"
        );
      }

      setUsers(data.users || []);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="team-page">

      {/* HEADER */}

      <div className="team-header">

        <div>
          <span className="team-label">
            WORKSPACE
          </span>

          <h1>Team</h1>

          <p>
            View the people using your TaskFlow
            workspace.
          </p>
        </div>

        <div className="team-header-icon">
          <Users size={23} />
        </div>

      </div>


      {/* STATS */}

      <div className="team-stats">

        <div className="team-stat">

          <div className="team-stat-icon">
            <Users size={19} />
          </div>

          <div>
            <span>Total Members</span>
            <strong>{users.length}</strong>
          </div>

        </div>


        <div className="team-stat">

          <div className="team-stat-icon">
            <UserRound size={19} />
          </div>

          <div>
            <span>Registered Users</span>
            <strong>{users.length}</strong>
          </div>

        </div>

      </div>


      {/* ERROR */}

      {error && (
        <div className="team-error">
          {error}
        </div>
      )}


      {/* USERS */}

      <section className="team-panel">

        <div className="team-panel-header">

          <div>
            <span>MEMBERS</span>

            <h2>
              Workspace Members
            </h2>
          </div>

          <strong>
            {users.length} Members
          </strong>

        </div>


        {loading ? (

          <div className="team-empty">
            Loading members...
          </div>

        ) : users.length === 0 ? (

          <div className="team-empty">

            <div className="team-empty-icon">
              <Users size={28} />
            </div>

            <h3>
              No members yet
            </h3>

            <p>
              Registered users will appear here.
            </p>

          </div>

        ) : (

          <div className="team-list">

            {users.map((user) => (

              <div
                className="team-member"
                key={user._id}
              >

                <div className="team-avatar">
                  {user.name
                    ?.charAt(0)
                    .toUpperCase()}
                </div>


                <div className="team-member-info">

                  <h3>
                    {user.name}
                  </h3>

                  <div className="team-email">

                    <Mail size={13} />

                    {user.email}

                  </div>

                </div>


                <div className="team-role">

                  <ShieldCheck size={14} />

                  Member

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default Team;