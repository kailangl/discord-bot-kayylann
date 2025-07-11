import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Head from "next/head";
import { Gift, Sparkles, X, Loader2, LogOut, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import { FaDiscord } from "react-icons/fa6";
interface GiftBoxProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
  disabled: boolean;
  loading: boolean;
  icon: React.ElementType;
  iconColor: string;
}

const GiftBox = ({
  title,
  description,
  buttonText,
  onButtonClick,
  disabled,
  loading,
  icon: Icon,
  iconColor,
}: GiftBoxProps) => (
  <div className="relative bg-gradient-to-br from-purple-800/30 to-blue-800/30 p-6 rounded-xl border border-purple-500/50 shadow-lg flex flex-col items-center text-center">
    <div className={`p-3 rounded-full ${iconColor} mb-4`}>
      <Icon size={40} strokeWidth={1.5} />
    </div>
    <h2 className="text-2xl font-bold mb-2 text-white">{title}</h2>
    <p className="text-gray-300 mb-6">{description}</p>
    <button
      onClick={onButtonClick}
      disabled={disabled || loading}
      className={`w-full py-3 px-6 rounded-full font-bold text-white transition-all duration-300 flex items-center justify-center gap-2
        ${
          disabled || loading
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 active:scale-95"
        }
      `}
    >
      {loading ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <Sparkles size={20} />
      )}
      {buttonText}
    </button>
  </div>
);

export default function RewardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [usedDaily, setUsedDaily] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingDaily, setLoadingDaily] = useState(false);
  const [loadingCode, setLoadingCode] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && router.isReady) {
      checkDailyStatus();
      const { linkvertise_success } = router.query;

      if (linkvertise_success === "true") {
        router.replace("/reward", undefined, { shallow: true });
        handleDailyClaimReward();
      }
    }
  }, [status, router.isReady, router.query]);

  const checkDailyStatus = async () => {
    if (!session?.user?.id) return;

    try {
      const { data, error: supabaseError } = await supabase
        .from("user")
        .select("last_claimed_at")
        .eq("user_id", session.user.id)
        .single();

      if (supabaseError && supabaseError.code !== "PGRST116") {
        throw supabaseError;
      }

      if (data?.last_claimed_at) {
        const lastClaim = new Date(data.last_claimed_at);
        const today = new Date();
        setUsedDaily(lastClaim.toDateString() === today.toDateString());
      } else {
        setUsedDaily(false);
      }
    } catch (err) {
      console.error("Error checking daily status:", err);
      setError("Error checking daily status.");
    }
  };

  const handleDailyClaimInitiate = () => {
    if (usedDaily || loadingDaily) return;
    setLoadingDaily(true);
    router.push("/daily-reward-redirect");
  };

  const handleDailyClaimReward = async () => {
    setError("");
    setSuccess("");
    try {
      const randomNumber = Math.floor(Math.random() * 5000) + 5000;

      const { data: user, error: userError } = await supabase
        .from("user")
        .select("wallet")
        .eq("user_id", session?.user?.id)
        .single();

      if (userError) throw userError;

      const { error: updateError } = await supabase
        .from("user")
        .update({
          last_claimed_at: new Date().toISOString(),
          wallet: (user?.wallet || 0) + randomNumber,
        })
        .eq("user_id", session?.user?.id);

      if (updateError) throw updateError;
      setSuccess(`+${randomNumber} coins! Daily reward claimed!`);
      setUsedDaily(true);
    } catch (error) {
      console.error("Error granting daily reward:", error);
      setError("Error claiming daily reward. Please try again.");
    } finally {
      setLoadingDaily(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoadingCode(true);

    try {
      if (!session?.user?.id)
        throw new Error("Please log in first to redeem codes.");
      if (!code.trim()) throw new Error("Please enter a code.");

      const { data, error: dbError } = await supabase
        .from("system_codes")
        .select("used_by_users")
        .eq("code", code.toUpperCase())
        .single();

      if (dbError || !data) throw new Error("Invalid or not found code.");
      if (data.used_by_users?.includes(session.user.id))
        throw new Error("You have already used this code.");

      const { data: user, error: userError } = await supabase
        .from("user")
        .select("wallet")
        .eq("user_id", session.user.id)
        .single();

      if (userError) throw userError;

      const coinReward = 5000;

      const { error: updateError } = await supabase
        .from("user")
        .update({
          wallet: (user?.wallet || 0) + coinReward,
        })
        .eq("user_id", session.user.id);

      if (updateError) throw updateError;

      const { error: codeUpdateError } = await supabase
        .from("system_codes")
        .update({
          used_by_users: [...(data.used_by_users || []), session.user.id],
        })
        .eq("code", code.toLowerCase());

      if (codeUpdateError) throw codeUpdateError;

      setSuccess(`🚀 Code redeemed successfully! +${coinReward} coins!`);
      setCode("");
    } catch (err) {
      console.error("Error submitting code:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error redeeming code. Please check and try again."
      );
    } finally {
      setLoadingCode(false);
    }
  };

  const handleGiftBoxClick = () => {
    window.open("https://link-hub.net/345156/rsmzIpne1a7t", "_blank");
  };
  const handleGiftBoxClick1 = () => {
    window.open("https://link-hub.net/345156/qRGx6N7FOt6U", "_blank");
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-xl">
        <Loader2 size={32} className="animate-spin mr-2" /> Loading...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-mainbg text-white p-8">
        <h1 className="text-3xl font-bold mb-6 text-purple-400">
          Access Your Rewards
        </h1>
        <p className="mb-8 text-gray-300 text-lg text-center">
          Log in to claim your daily rewards and use special codes.
        </p>
        <button
          onClick={() => signIn("discord")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg flex items-center gap-3"
        >
          <FaDiscord size={20} />
          Login with Discord
        </button>
      </div>
    );
  }

  return (
    <>
      <Header />
      <Head>
        <title>Rewards - Bot</title>
        <meta
          name="description"
          content="Claim your daily rewards and special bot codes."
        />
      </Head>
      <div className="min-h-screen bg-mainbg text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto py-8">
          <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-[#B123F3] to-[#2684FF] bg-clip-text text-transparent">
            Reward Hub
          </h1>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg flex items-center justify-between mb-6 shadow-md">
              <span className="flex items-center">
                <X size={20} className="mr-2" /> {error}
              </span>
              <button
                onClick={() => setError("")}
                className="text-red-300 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          )}
          {success && (
            <div className="bg-green-900/50 border border-green-700 text-green-300 p-4 rounded-lg flex items-center justify-between mb-6 shadow-md">
              <span className="flex items-center">
                <CheckCircle2 size={20} className="mr-2" /> {success}
              </span>
              <button
                onClick={() => setSuccess("")}
                className="text-green-300 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-black/20 p-8 rounded-xl border-2 border-b-purple-500/70 border-t-blue-500/50 border-l-purple-500/50 border-r-blue-500/80 shadow-xl flex flex-col items-center text-center">
              <div
                className={`p-4 rounded-full ${
                  usedDaily ? "bg-gray-700" : "bg-green-600"
                } mb-5`}
              >
                <Sparkles
                  size={48}
                  className={`${
                    usedDaily ? "text-gray-400" : "text-yellow-300"
                  }`}
                  strokeWidth={1.5}
                />
              </div>
              <h2 className="text-3xl font-bold mb-3 text-white">
                Daily Reward
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                {usedDaily
                  ? "✅ You've already claimed your reward for today! Come back tomorrow for more."
                  : "Claim your exclusive daily reward now!"}
              </p>
              <button
                onClick={handleDailyClaimInitiate}
                disabled={usedDaily || loadingDaily}
                className={`w-full py-3 px-6 rounded-full text-lg font-bold text-white transition-all duration-300 flex items-center justify-center gap-2
                  ${
                    usedDaily || loadingDaily
                      ? "bg-gray-700/50 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 active:scale-95"
                  }
                `}
              >
                {loadingDaily ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : usedDaily ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <Gift size={20} />
                )}
                {usedDaily ? "Claimed" : "Claim Now"}
              </button>
            </div>

            <div className="bg-black/20 p-8 rounded-xl border-2 border-b-purple-500/70 border-t-blue-500/50 border-l-purple-500/50 border-r-blue-500/80 shadow-xl flex flex-col">
              <div className="p-4 rounded-full bg-purple-600 mb-5 self-center">
                <Sparkles size={48} className="text-white" strokeWidth={1.5} />
              </div>
              <h2 className="text-3xl font-bold mb-3 text-white text-center">
                Special Codes
              </h2>
              <p className="text-gray-300 text-lg mb-6 text-center">
                Have a special code? Enter it below to unlock unique rewards!
              </p>
              <form onSubmit={handleCodeSubmit} className="space-y-5">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toLowerCase())}
                  placeholder="Enter your code here"
                  className="w-full p-4 rounded-lg bg-black/30 text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-lg"
                />
                <button
                  type="submit"
                  disabled={loadingCode || !code.trim()}
                  className={`w-full py-3 px-6 rounded-full text-lg font-bold text-white transition-all duration-300 flex items-center justify-center gap-2
                    ${
                      loadingCode || !code.trim()
                        ? "bg-gray-700/50 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 active:scale-95"
                    }
                  `}
                >
                  {loadingCode ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Sparkles size={20} />
                  )}
                  Redeem Code
                </button>
              </form>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <GiftBox
              title="Surprise Gift I"
              description="Redeem your exclusive gift code to unlock a special surprise."
              buttonText="Redeem Gift"
              onButtonClick={handleGiftBoxClick}
              disabled={false}
              loading={false}
              icon={Gift}
              iconColor="text-pink-400 bg-pink-900/30"
            />
            <GiftBox
              title="Mysterious Gift II"
              description="A new reward opportunity awaits you. Don't miss out! USE THE CODE BELOW."
              buttonText="Redeem Gift"
              onButtonClick={handleGiftBoxClick1}
              disabled={false}
              loading={false}
              icon={Gift}
              iconColor="text-teal-400 bg-teal-900/30"
            />
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => signOut()}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white px-6 py-3 rounded-full transition-colors duration-200 border border-gray-700 hover:border-white"
            >
              <LogOut size={20} /> Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}